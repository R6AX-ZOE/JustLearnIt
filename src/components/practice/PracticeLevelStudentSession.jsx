import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchSession, fetchSessionStart, submitAnswer, nextQuestion, completeSession, fetchSessionEnd } from './services/api';
import QuestionRenderer from './components/QuestionRenderer';
import { styles } from './styles';

const PracticeLevelStudentSession = ({ mode }) => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const isLoadingRef = useRef(false);

  const [session, setSession] = useState(null);
  const [startInfo, setStartInfo] = useState(null);
  const [endInfo, setEndInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const loadSessionData = useCallback(async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    setLoading(true);
    setError(null);

    try {
      if (mode === 'start') {
        const [sessionData, startData] = await Promise.all([
          fetchSession(sessionId),
          fetchSessionStart(sessionId)
        ]);
        setSession(sessionData);
        setStartInfo(startData);
      } else if (mode === 'practice') {
        const sessionData = await fetchSession(sessionId);
        setSession(sessionData);
        if (sessionData.questions && sessionData.questions.length > 0) {
          const questionIndex = sessionData.currentQuestionIndex || 0;
          setCurrentQuestionIndex(questionIndex);
          setCurrentQuestion(sessionData.questions[questionIndex]);
          setUserAnswers(sessionData.answers || {});
          const currentAnswer = sessionData.answers && sessionData.answers[sessionData.questions[questionIndex].id];
          setHasAnswered(!!currentAnswer);
          if (currentAnswer) {
            setFeedback(prev => ({
              ...prev,
              [sessionData.questions[questionIndex].id]: {
                message: currentAnswer.feedback,
                isCorrect: currentAnswer.isCorrect
              }
            }));
          }
        }
      } else if (mode === 'end') {
        const endData = await fetchSessionEnd(sessionId);
        setEndInfo(endData);
      }
    } catch (err) {
      console.error('Error loading session:', err);
      setError(err.message || 'Failed to load session');
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [sessionId, mode]);

  useEffect(() => {
    isLoadingRef.current = false;
    loadSessionData();
  }, [loadSessionData]);

  const handleStartPractice = () => {
    navigate(`/practice/student/session/${sessionId}/practice`);
  };

  const handleSubmitAnswer = async (answer) => {
    if (isSubmitting || hasAnswered) return;
    setIsSubmitting(true);

    try {
      const result = await submitAnswer(sessionId, answer);
      setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
      setFeedback(prev => ({
        ...prev,
        [currentQuestion.id]: {
          message: result.feedback,
          isCorrect: result.isCorrect
        }
      }));
      setHasAnswered(true);
    } catch (err) {
      console.error('Error submitting answer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = async () => {
    if (!session) return;

    if (currentQuestionIndex >= session.totalQuestions - 1) {
      await handleComplete();
      return;
    }

    try {
      const result = await nextQuestion(sessionId);
      if (result.isLastQuestion) {
        await handleComplete();
      } else {
        setCurrentQuestionIndex(result.currentQuestionIndex);
        setCurrentQuestion(result.question);
        setHasAnswered(result.hasAnswered);
        if (result.hasAnswered && session.answers[result.question.id]) {
          setFeedback(prev => ({
            ...prev,
            [result.question.id]: {
              message: session.answers[result.question.id].feedback,
              isCorrect: session.answers[result.question.id].isCorrect
            }
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching next question:', err);
    }
  };

  const handleComplete = async () => {
    try {
      await completeSession(sessionId);
      navigate(`/practice/student/session/${sessionId}/end`);
    } catch (err) {
      console.error('Error completing session:', err);
    }
  };

  const handleFinish = () => {
    navigate('/practice/student');
  };

  const handleViewDetails = () => {
    setShowReview(true);
  };

  const handleBackToEnd = () => {
    setShowReview(false);
  };

  const handleModeChange = (newMode) => {
    if (newMode === 'creator') {
      navigate('/practice/creator');
    } else if (newMode === 'student') {
      navigate('/practice/student');
    }
  };

  const renderReviewQuestion = (question, index) => {
    const answer = endInfo.answers[question.id];
    const userAnswer = answer?.answer;
    const correctAnswer = question.correctAnswer;
    const isCorrect = answer?.isCorrect;

    return (
      <div key={question.id} className="review-question">
        <div className="review-question-header">
          <h4 className="review-question-number">Question {index + 1}</h4>
          <span className={`review-question-status ${isCorrect ? 'correct' : 'incorrect'}`}>
            {isCorrect ? '✓ Correct' : '✗ Incorrect'}
          </span>
        </div>
        <p className="review-question-text">{question.question}</p>

        {question.type === 'multiple-choice' && (
          <div className="review-options">
            {question.options.map((option, optIndex) => {
              const isSelected = userAnswer === option;
              const isRightAnswer = option === correctAnswer;

              let optionClass = 'review-option';
              if (isRightAnswer) optionClass += ' review-option-correct';
              else if (isSelected) optionClass += ' review-option-incorrect';

              return (
                <div key={optIndex} className={optionClass}>
                  <span className="review-option-label">{optIndex + 1}. </span>
                  <span className="review-option-text">{option}</span>
                  {isRightAnswer && <span className="review-option-badge">✓ Correct Answer</span>}
                  {isSelected && !isRightAnswer && <span className="review-option-badge">✗ Your Answer</span>}
                </div>
              );
            })}
          </div>
        )}

        {question.type === 'fill-blank' && (
          <div className="review-fill-blank">
            <div className="review-answer-display">
              <span className="review-label">Your Answer:</span>
              <span className={`review-value ${isCorrect ? 'correct' : 'incorrect'}`}>{userAnswer || '(no answer)'}</span>
            </div>
            <div className="review-answer-display">
              <span className="review-label">Correct Answer:</span>
              <span className="review-value correct">{correctAnswer}</span>
            </div>
          </div>
        )}

        {question.type === 'essay' && (
          <div className="review-essay">
            <div className="review-answer-display">
              <span className="review-label">Your Answer:</span>
              <div className="review-essay-value">{userAnswer || '(no answer)'}</div>
            </div>
          </div>
        )}

        {answer?.feedback && (
          <div className="review-feedback">
            <h5 className="review-feedback-label">Feedback:</h5>
            <div className="review-feedback-text">{answer.feedback}</div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="practice-level">
        <div className="loading-spinner">Loading...</div>
        <style>{styles}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="practice-level">
        <div className="practice-header">
          <div className="header-left">
            <h2>Practice Level</h2>
            <div className="navigation-links">
              <a href="/" className="nav-link">Home</a>
              <a href="/integration" className="nav-link">Integration Level</a>
            </div>
          </div>
          <div className="header-right">
            <div className="mode-switcher">
              <button
                className="mode-btn active"
                onClick={() => handleModeChange('student')}
              >
                Practice Mode
              </button>
              <button
                className="mode-btn"
                onClick={() => handleModeChange('creator')}
              >
                Create Mode
              </button>
            </div>
          </div>
        </div>
        <div className="practice-content">
          <div className="error-message">
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/practice/student')}>Back to Home</button>
          </div>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  if (mode === 'start') {
    const isInProgress = startInfo?.currentQuestionIndex > 0;
    const nextQuestionNumber = (startInfo?.currentQuestionIndex || 0) + 1;

    return (
      <div className="practice-level">
        <div className="practice-header">
          <div className="header-left">
            <h2>Practice Level</h2>
            <div className="navigation-links">
              <a href="/" className="nav-link">Home</a>
              <a href="/integration" className="nav-link">Integration Level</a>
            </div>
          </div>
          <div className="header-right">
            <div className="mode-switcher">
              <button
                className="mode-btn active"
                onClick={() => {}}
              >
                Practice Mode
              </button>
              <button
                className="mode-btn"
                onClick={() => handleModeChange('creator')}
              >
                Create Mode
              </button>
            </div>
          </div>
        </div>

        <div className="practice-content">
          <div className="start-container">
            <div className="start-header">
              <h1>{startInfo?.practiceName || 'Practice Session'}</h1>
              <p className="subtitle">{isInProgress ? 'Continue where you left off' : 'Ready to begin?'}</p>
            </div>

            <div className="start-info">
              <div className="info-card">
                <div className="info-icon">📝</div>
                <div className="info-content">
                  <h3>{startInfo?.totalQuestions || 0} Questions</h3>
                  <p>Total questions in this practice</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">{isInProgress ? '🔄' : '⏱️'}</div>
                <div className="info-content">
                  <h3>{isInProgress ? 'In Progress' : 'New'}</h3>
                  <p>{isInProgress ? `Resume from Question ${nextQuestionNumber}` : 'Starting from Question 1'}</p>
                </div>
              </div>
              {isInProgress && (
                <div className="info-card">
                  <div className="info-icon">✅</div>
                  <div className="info-content">
                    <h3>{startInfo?.currentQuestionIndex} Completed</h3>
                    <p>{startInfo?.totalQuestions - startInfo?.currentQuestionIndex} remaining</p>
                  </div>
                </div>
              )}
            </div>

            <div className="start-actions">
              <Link to="/practice/student" className="btn btn-secondary">Back to Home</Link>
              <button className="btn btn-primary" onClick={handleStartPractice}>
                {isInProgress ? 'Continue Practice' : 'Begin Practice'}
              </button>
            </div>
          </div>
        </div>

        <style>{styles}</style>
      </div>
    );
  }

  if (mode === 'practice') {
    return (
      <div className="practice-level">
        <div className="practice-header">
          <div className="header-left">
            <h2>Practice Level</h2>
            <div className="navigation-links">
              <a href="/" className="nav-link">Home</a>
              <a href="/integration" className="nav-link">Integration Level</a>
            </div>
          </div>
          <div className="header-right">
            <div className="mode-switcher">
              <button
                className="mode-btn active"
                onClick={() => {}}
              >
                Practice Mode
              </button>
              <button
                className="mode-btn"
                onClick={() => handleModeChange('creator')}
              >
                Create Mode
              </button>
            </div>
          </div>
        </div>

        <div className="practice-content">
          <div className="practice-header-bar">
            <div className="header-left">
              <h3>{session?.practiceName}</h3>
              <span className="question-counter">
                Question {currentQuestionIndex + 1} of {session?.totalQuestions}
              </span>
            </div>
            <div className="header-right">
              <div className="progress-indicator">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${((currentQuestionIndex + 1) / session.totalQuestions) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>

          <div className="practice-main">
            {currentQuestion && session && (
              <QuestionRenderer
                questions={session.questions}
                currentQuestionIndex={currentQuestionIndex}
                userAnswers={userAnswers}
                setUserAnswers={() => {}}
                feedback={feedback}
                setFeedback={() => {}}
                handleSubmitButtonClick={() => handleSubmitAnswer(userAnswers[currentQuestion.id])}
                handlePreviousQuestion={() => {}}
                handleNextQuestion={handleNextQuestion}
                mode="student"
                isSubmitting={isSubmitting}
                hasAnswered={hasAnswered}
                onAnswerChange={(answer) => {
                  setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
                }}
              />
            )}
          </div>
        </div>

        <style>{styles}</style>
      </div>
    );
  }

  if (mode === 'end' && showReview) {
    return (
      <div className="practice-level">
        <div className="practice-header">
          <div className="header-left">
            <h2>Practice Level</h2>
            <div className="navigation-links">
              <a href="/" className="nav-link">Home</a>
              <a href="/integration" className="nav-link">Integration Level</a>
            </div>
          </div>
          <div className="header-right">
            <div className="mode-switcher">
              <button
                className="mode-btn active"
                onClick={() => {}}
              >
                Practice Mode
              </button>
              <button
                className="mode-btn"
                onClick={() => handleModeChange('creator')}
              >
                Create Mode
              </button>
            </div>
          </div>
        </div>

        <div className="practice-content">
          <div className="review-container">
            <div className="review-header">
              <button className="btn btn-secondary btn-small" onClick={handleBackToEnd}>
                ← Back to Summary
              </button>
              <h2>Review Your Answers</h2>
              <p className="subtitle">{endInfo?.practiceName}</p>
            </div>

            <div className="review-summary">
              <div className="review-score">
                <span className="review-score-value">{endInfo?.score || 0}%</span>
                <span className="review-score-label">Final Score</span>
              </div>
              <div className="review-stats">
                <div className="review-stat">
                  <span className="review-stat-value correct">{endInfo?.correctCount || 0}</span>
                  <span className="review-stat-label">Correct</span>
                </div>
                <div className="review-stat">
                  <span className="review-stat-value incorrect">{(endInfo?.totalQuestions || 0) - (endInfo?.correctCount || 0)}</span>
                  <span className="review-stat-label">Incorrect</span>
                </div>
              </div>
            </div>

            <div className="review-questions">
              {endInfo?.questions?.map((question, index) => renderReviewQuestion(question, index))}
            </div>

            <div className="review-footer">
              <button className="btn btn-primary" onClick={handleFinish}>
                Done Reviewing
              </button>
            </div>
          </div>
        </div>

        <style>{styles}</style>
      </div>
    );
  }

  if (mode === 'end') {
    return (
      <div className="practice-level">
        <div className="practice-header">
          <div className="header-left">
            <h2>Practice Level</h2>
            <div className="navigation-links">
              <a href="/" className="nav-link">Home</a>
              <a href="/integration" className="nav-link">Integration Level</a>
            </div>
          </div>
          <div className="header-right">
            <div className="mode-switcher">
              <button
                className="mode-btn active"
                onClick={() => {}}
              >
                Practice Mode
              </button>
              <button
                className="mode-btn"
                onClick={() => handleModeChange('creator')}
              >
                Create Mode
              </button>
            </div>
          </div>
        </div>

        <div className="practice-content">
          <div className="end-container">
            <div className="end-header">
              <h1>Practice Complete!</h1>
              <p className="subtitle">{endInfo?.practiceName}</p>
            </div>

            <div className="score-section">
              <div className="score-circle">
                <span className="score-value">{endInfo?.score || 0}%</span>
              </div>
              <div className="score-details">
                <div className="detail-item">
                  <span className="detail-label">Correct Answers</span>
                  <span className="detail-value">
                    {endInfo?.correctCount || 0} / {endInfo?.totalQuestions || 0}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Completed</span>
                  <span className="detail-value">
                    {endInfo?.completedAt ? new Date(endInfo.completedAt).toLocaleString() : '-'}
                  </span>
                </div>
              </div>
            </div>

            <div className="end-message">
              {endInfo?.score >= 80 ? (
                <p className="message success">Excellent work! Keep it up!</p>
              ) : endInfo?.score >= 60 ? (
                <p className="message good">Good job! Room for improvement.</p>
              ) : (
                <p className="message retry">Keep practicing, you will get better!</p>
              )}
            </div>

            <div className="end-actions">
              <button className="btn btn-secondary" onClick={handleFinish}>
                Back to Home
              </button>
              <button className="btn btn-primary" onClick={handleViewDetails}>
                Review Answers
              </button>
            </div>
          </div>
        </div>

        <style>{styles}</style>
      </div>
    );
  }

  return null;
};

export default PracticeLevelStudentSession;
