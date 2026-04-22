import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { pluginSystem, registerPlugins } from '../../../plugins/index';

marked.use({
  renderer: {
    code(code, infostring) {
      if (infostring === 'math') {
        try {
          return katex.renderToString(code, {
            throwOnError: false
          });
        } catch (error) {
          return `<pre>${error.message}</pre>`;
        }
      }
      return `<pre><code>${code}</code></pre>`;
    }
  },
  extensions: [
    {
      name: 'math',
      level: 'block',
      start(src) {
        return src.indexOf('\\[');
      },
      tokenizer(src) {
        const match = src.match(/^\\\[(.*?)\\\]$/s);
        if (match) {
          return {
            type: 'code',
            raw: match[0],
            text: match[1],
            lang: 'math'
          };
        }
      }
    }
  ]
});

const renderMarkdown = (text) => {
  if (!text) return '';

  let processedText = text;
  processedText = processedText.replace(/\\\((.*?)\\\)/g, (match, formula) => {
    try {
      return katex.renderToString(formula, {
        throwOnError: false,
        displayMode: false
      });
    } catch (error) {
      return match;
    }
  });

  return {
    __html: marked(processedText)
  };
};

const QuestionRenderer = ({
  questions,
  currentQuestionIndex,
  userAnswers,
  setUserAnswers,
  feedback,
  setFeedback,
  handleSubmitButtonClick,
  handlePreviousQuestion,
  handleNextQuestion,
  nodeMap = new Map(),
  mode = 'creator',
  isSubmitting = false,
  hasAnswered = false,
  onAnswerChange = null
}) => {
  const navigate = useNavigate();
  const [pluginsLoaded, setPluginsLoaded] = useState(false);

  useEffect(() => {
    const loadPlugins = async () => {
      try {
        registerPlugins();
        await pluginSystem.loadAllPlugins();
        setPluginsLoaded(true);
        console.log('All plugins loaded successfully');
      } catch (error) {
        console.error('Error loading plugins:', error);
        setPluginsLoaded(true);
      }
    };

    loadPlugins();
  }, []);

  const getFeedbackClassName = (questionFeedback) => {
    if (!questionFeedback) return '';
    if (typeof questionFeedback === 'object' && questionFeedback.isCorrect !== undefined) {
      return questionFeedback.isCorrect ? 'feedback correct' : 'feedback incorrect';
    }
    return 'feedback';
  };

  const executeFeedbackExpression = (expression, question, answer, isCorrect) => {
    if (!expression) return '';

    try {
      const sandbox = {
        question,
        answer,
        isCorrect,
        Math,
        plugins: {
          execute: async (pluginName, methodName, ...args) => {
            try {
              return await pluginSystem.executePluginMethod(pluginName, methodName, ...args);
            } catch (error) {
              console.error(`Error executing plugin ${pluginName}.${methodName}:`, error);
              return null;
            }
          }
        }
      };

      try {
        const func = new Function('question', 'answer', 'isCorrect', 'Math', 'plugins', `return ${expression}`);
        return func(question, answer, isCorrect, Math, sandbox.plugins);
      } catch (exprError) {
        try {
          const func = new Function('question', 'answer', 'isCorrect', 'Math', 'plugins', expression);
          return func(question, answer, isCorrect, Math, sandbox.plugins);
        } catch (funcError) {
          throw new Error(`Both expression and function execution failed: ${exprError.message} | ${funcError.message}`);
        }
      }
    } catch (error) {
      console.error('Error executing feedback expression:', error.message);
      return `Error executing feedback: ${error.message}`;
    }
  };

  const getFeedbackMessage = (questionFeedback) => {
    if (!questionFeedback) return '';
    if (typeof questionFeedback === 'object' && questionFeedback.message) {
      return questionFeedback.message;
    }
    return questionFeedback;
  };

  const getNodeDisplayInfo = (nodeId) => {
    return nodeMap.get(nodeId) || null;
  };

  const renderLinkedNodes = (question) => {
    if (!question.nodes || question.nodes.length === 0) {
      return null;
    }

    return (
      <div className="linked-nodes-section">
        <h5>Linked Nodes</h5>
        <ul className="linked-nodes-list">
          {question.nodes.map((nodeId, index) => {
            const nodeInfo = getNodeDisplayInfo(nodeId);
            return (
              <li key={index} className="linked-node-item" style={{ cursor: 'pointer' }}>
                <span
                  onClick={() => {
                    if (nodeInfo) {
                      navigate(`/integration/${nodeInfo.projectId}/${nodeInfo.graphId}/${nodeId}`);
                    }
                  }}
                >
                  {nodeInfo ? `${nodeInfo.data.label} (${nodeInfo.projectName} / ${nodeInfo.graphName})` : `Node ${nodeId}`}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const handleAnswerChange = (questionId, value) => {
    if (onAnswerChange) {
      onAnswerChange(value);
    } else if (setUserAnswers) {
      setUserAnswers(prev => ({ ...prev, [questionId]: value }));
    }
  };

  const renderMultipleChoiceQuestion = (question) => {
    const userAnswer = userAnswers[question.id];
    const questionFeedback = feedback[question.id];
    const isStudentMode = mode === 'student';

    return (
      <div className="question-content">
        <p>{question.question}</p>
        <div className="options">
          {question.options.map((option, index) => {
            const optionLabel = String.fromCharCode(65 + index);
            const isSelected = userAnswer === optionLabel;
            const showCorrect = isStudentMode && hasAnswered && optionLabel === question.correctAnswer;
            const showIncorrect = isStudentMode && hasAnswered && isSelected && optionLabel !== question.correctAnswer;

            return (
              <div
                key={optionLabel}
                className={`option ${showCorrect ? 'correct-answer' : ''} ${showIncorrect ? 'incorrect-answer' : ''}`}
              >
                <input
                  type="radio"
                  id={`option-${optionLabel}`}
                  name={`question-${question.id}`}
                  value={optionLabel}
                  checked={isSelected}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  disabled={isStudentMode && hasAnswered}
                />
                <label htmlFor={`option-${optionLabel}`}>
                  <span className="option-label">{optionLabel}.</span> {option}
                  {showCorrect && <span className="answer-badge">Correct</span>}
                  {showIncorrect && <span className="answer-badge">Your answer</span>}
                </label>
              </div>
            );
          })}
        </div>
        {renderLinkedNodes(question)}
        {!isStudentMode && (
          <div className="submit-button-container">
            <button
              className="btn btn-primary"
              onClick={handleSubmitButtonClick}
              disabled={!userAnswer}
            >
              Submit Answer
            </button>
          </div>
        )}
        {isStudentMode && hasAnswered && questionFeedback && (
          <div className={getFeedbackClassName(questionFeedback)}>
            <div dangerouslySetInnerHTML={renderMarkdown(getFeedbackMessage(questionFeedback))} />
          </div>
        )}
        {isStudentMode && !hasAnswered && (
          <div className="submit-button-container">
            <button
              className="btn btn-primary"
              onClick={handleSubmitButtonClick}
              disabled={!userAnswer || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Answer'}
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderFillBlankQuestion = (question) => {
    const userAnswer = userAnswers[question.id] || '';
    const questionFeedback = feedback[question.id];
    const isStudentMode = mode === 'student';

    return (
      <div className="question-content">
        <p>{question.question}</p>
        <div className="fill-blank">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Enter your answer here"
            disabled={isStudentMode && hasAnswered}
          />
        </div>
        {isStudentMode && hasAnswered && (
          <div className="correct-answer-display">
            Correct Answer: {question.correctAnswer}
          </div>
        )}
        {renderLinkedNodes(question)}
        {!isStudentMode && (
          <div className="submit-button-container">
            <button
              className="btn btn-primary"
              onClick={handleSubmitButtonClick}
              disabled={!userAnswer}
            >
              Submit Answer
            </button>
          </div>
        )}
        {isStudentMode && hasAnswered && questionFeedback && (
          <div className={getFeedbackClassName(questionFeedback)}>
            <div dangerouslySetInnerHTML={renderMarkdown(getFeedbackMessage(questionFeedback))} />
          </div>
        )}
        {isStudentMode && !hasAnswered && (
          <div className="submit-button-container">
            <button
              className="btn btn-primary"
              onClick={handleSubmitButtonClick}
              disabled={!userAnswer || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Answer'}
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderEssayQuestion = (question) => {
    const userAnswer = userAnswers[question.id] || '';
    const questionFeedback = feedback[question.id];
    const isStudentMode = mode === 'student';

    return (
      <div className="question-content">
        <p>{question.question}</p>
        <div className="essay">
          <textarea
            value={userAnswer}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Write your answer here"
            rows={5}
            disabled={isStudentMode && hasAnswered}
          />
        </div>
        {renderLinkedNodes(question)}
        {!isStudentMode && (
          <div className="submit-button-container">
            <button
              className="btn btn-primary"
              onClick={handleSubmitButtonClick}
              disabled={!userAnswer}
            >
              Submit Answer
            </button>
          </div>
        )}
        {isStudentMode && hasAnswered && questionFeedback && (
          <div className={getFeedbackClassName(questionFeedback)}>
            <div dangerouslySetInnerHTML={renderMarkdown(getFeedbackMessage(questionFeedback))} />
          </div>
        )}
        {isStudentMode && !hasAnswered && (
          <div className="submit-button-container">
            <button
              className="btn btn-primary"
              onClick={handleSubmitButtonClick}
              disabled={!userAnswer || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Answer'}
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderSummaryPage = () => {
    if (questions.length === 0) {
      return <p className="no-questions">No questions available. Create a question to get started!</p>;
    }

    const answeredQuestions = Object.keys(userAnswers).length;
    const totalQuestions = questions.length;
    const completionRate = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

    return (
      <div className="summary-page">
        <h3>Practice Summary</h3>
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-label">Total Questions:</span>
            <span className="stat-value">{totalQuestions}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Answered Questions:</span>
            <span className="stat-value">{answeredQuestions}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completion Rate:</span>
            <span className="stat-value">{completionRate}%</span>
          </div>
        </div>

        <div className="summary-actions">
          <button
            className="btn btn-primary"
            onClick={() => {
              setUserAnswers({});
              setFeedback({});
              if (handleNextQuestion) {
                handleNextQuestion(true);
              }
            }}
            disabled={totalQuestions === 0}
          >
            Start Practice
          </button>
        </div>

        {answeredQuestions > 0 && (
          <div className="summary-details">
            <h4>Your Answers</h4>
            <div className="answers-list">
              {questions.map((question, index) => {
                const userAnswer = userAnswers[question.id];
                const questionFeedback = feedback[question.id];

                return (
                  <div key={question.id} className="answer-item">
                    <div className="answer-header">
                      <span className="answer-number">Q{index + 1}:</span>
                      <span className="answer-question">{question.question}</span>
                    </div>
                    {userAnswer && (
                      <div className="answer-content">
                        <span className="answer-label">Your Answer:</span>
                        <span className="answer-value">{userAnswer}</span>
                      </div>
                    )}
                    {questionFeedback && (
                      <div className="answer-feedback">
                        <span className="feedback-label">Feedback:</span>
                        <span className={typeof questionFeedback === 'object' && questionFeedback.isCorrect ? 'feedback-value correct' : 'feedback-value incorrect'}>
                          <div dangerouslySetInnerHTML={renderMarkdown(getFeedbackMessage(questionFeedback))} />
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderQuestion = () => {
    if (questions.length === 0) {
      return <p className="no-questions">No questions available. Create a question to get started!</p>;
    }

    if (currentQuestionIndex === -1) {
      return renderSummaryPage();
    }

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case 'multiple-choice':
        return renderMultipleChoiceQuestion(currentQuestion);
      case 'fill-blank':
        return renderFillBlankQuestion(currentQuestion);
      case 'essay':
        return renderEssayQuestion(currentQuestion);
      default:
        return <p>Invalid question type</p>;
    }
  };

  const isStudentMode = mode === 'student';

  return (
    <div className="question-container">
      {!isStudentMode && (
        <div className="question-header">
          {currentQuestionIndex === -1 ? (
            <h4>Practice Summary</h4>
          ) : (
            <>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
              <div className="progress-text">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
            </>
          )}
        </div>
      )}
      {renderQuestion()}

      {!isStudentMode && (
        <div className="question-navigation">
          <button
            className="btn btn-secondary"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleNextQuestion()}
            disabled={questions.length === 0}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      )}

      {isStudentMode && hasAnswered && (
        <div className="question-navigation">
          <button
            className="btn btn-primary"
            onClick={handleNextQuestion}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish Practice' : 'Next Question'}
          </button>
        </div>
      )}

      <style>{`
        .question-container {
          background: var(--bg);
          border-radius: 12px;
          padding: 24px;
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
        }

        .question-header {
          margin-bottom: 20px;
        }

        .question-header h4 {
          margin: 0;
          font-size: 20px;
          color: var(--text-h);
        }

        .progress-bar {
          height: 8px;
          background: var(--border);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-bar-fill {
          height: 100%;
          background: var(--accent);
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 14px;
          color: var(--text);
        }

        .question-content {
          margin-bottom: 20px;
        }

        .question-content p {
          font-size: 18px;
          color: var(--text);
          margin: 0 0 20px 0;
          line-height: 1.6;
        }

        .options {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .option {
          display: flex;
          align-items: center;
          padding: 14px 16px;
          background: var(--bg);
          border-radius: 8px;
          border: 2px solid var(--border);
          transition: all 0.2s;
        }

        .option:hover {
          background: var(--bg);
          border-color: var(--accent);
        }

        .option.correct-answer {
          background: #d4edda;
          border-color: #28a745;
        }

        .option.incorrect-answer {
          background: #f8d7da;
          border-color: #dc3545;
        }

        .option input[type="radio"] {
          width: 20px;
          height: 20px;
          margin-right: 12px;
          cursor: pointer;
          accent-color: var(--accent);
        }

        .option label {
          flex: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .option-label {
          font-weight: 600;
          color: var(--text);
        }

        .answer-badge {
          margin-left: auto;
          padding: 4px 8px;
          font-size: 12px;
          border-radius: 4px;
        }

        .correct-answer .answer-badge {
          background: #28a745;
          color: white;
        }

        .incorrect-answer .answer-badge {
          background: #dc3545;
          color: white;
        }

        .fill-blank input,
        .essay textarea {
          width: 100%;
          padding: 12px;
          font-size: 16px;
          border: 2px solid var(--border);
          border-radius: 8px;
          transition: border-color 0.2s;
          background: var(--bg);
          color: var(--text);
        }

        .fill-blank input:focus,
        .essay textarea:focus {
          outline: none;
          border-color: var(--accent);
        }

        .correct-answer-display {
          margin-top: 10px;
          padding: 10px;
          background: #d4edda;
          border-radius: 6px;
          color: #155724;
          font-size: 14px;
        }

        .linked-nodes-section {
          margin: 20px 0;
          padding: 16px;
          background: var(--bg);
          border-radius: 8px;
          border: 1px solid var(--border);
        }

        .linked-nodes-section h5 {
          margin: 0 0 10px 0;
          font-size: 14px;
          color: var(--text);
        }

        .linked-nodes-list {
          margin: 0;
          padding: 0 0 0 20px;
          font-size: 14px;
        }

        .linked-node-item {
          color: var(--accent);
          margin-bottom: 4px;
        }

        .submit-button-container {
          margin: 20px 0;
        }

        .btn {
          padding: 12px 24px;
          font-size: 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .btn-primary {
          background: var(--accent);
          color: white;
          font-weight: 600;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          opacity: 0.9;
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: var(--bg);
          color: var(--text);
          border: 1px solid var(--border);
        }

        .btn-secondary:hover:not(:disabled) {
          background: var(--bg);
          border-color: var(--accent);
        }

        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .feedback {
          padding: 16px;
          border-radius: 8px;
          margin-top: 16px;
          font-size: 15px;
          line-height: 1.5;
        }

        .feedback.correct {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
        }

        .feedback.incorrect {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
        }

        .question-navigation {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid var(--border);
        }

        .question-navigation .btn-primary {
          flex: 1;
        }

        .summary-page {
          text-align: center;
        }

        .summary-page h3 {
          font-size: 24px;
          color: var(--text-h);
          margin-bottom: 24px;
        }

        .summary-stats {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-bottom: 32px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stat-label {
          font-size: 14px;
          color: var(--text);
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: var(--text-h);
        }

        .summary-actions {
          margin-bottom: 32px;
        }

        .summary-details {
          text-align: left;
        }

        .summary-details h4 {
          font-size: 18px;
          color: var(--text-h);
          margin-bottom: 16px;
        }

        .answers-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .answer-item {
          padding: 16px;
          background: var(--bg);
          border-radius: 8px;
          border: 1px solid var(--border);
        }

        .answer-header {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }

        .answer-number {
          font-weight: 600;
          color: var(--accent);
        }

        .answer-question {
          color: var(--text);
        }

        .answer-content,
        .answer-feedback {
          margin-top: 8px;
          padding-left: 16px;
        }

        .answer-label,
        .feedback-label {
          font-size: 14px;
          color: var(--text);
        }

        .answer-value {
          color: var(--text);
          font-weight: 500;
        }

        .no-questions {
          text-align: center;
          color: var(--text);
          font-size: 16px;
          padding: 40px;
        }
      `}</style>
    </div>
  );
};

export default QuestionRenderer;
