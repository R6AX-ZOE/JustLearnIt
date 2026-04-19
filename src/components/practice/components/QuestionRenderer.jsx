import React from 'react';
import { marked } from 'marked';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// 配置 marked 以支持 KaTeX
marked.use({
  renderer: {
    code(code, infostring) {
      // 处理数学公式
      if (infostring === 'math') {
        try {
          return katex.renderToString(code, {
            throwOnError: false
          });
        } catch (error) {
          return `<pre>${error.message}</pre>`;
        }
      }
      // 处理其他代码
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

// 处理内联数学公式
const renderMarkdown = (text) => {
  if (!text) return '';
  
  // 处理内联数学公式
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
  
  // 处理块级数学公式和其他 Markdown
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
  handleSubmitButtonClick,
  handlePreviousQuestion,
  handleNextQuestion,
  nodeMap = new Map()
}) => {
  // 获取反馈的CSS类名
  const getFeedbackClassName = (questionFeedback) => {
    if (!questionFeedback) return '';
    if (typeof questionFeedback === 'object' && questionFeedback.isCorrect !== undefined) {
      return questionFeedback.isCorrect ? 'feedback correct' : 'feedback incorrect';
    }
    return 'feedback';
  };

  // 获取反馈消息
  const getFeedbackMessage = (questionFeedback) => {
    if (!questionFeedback) return '';
    if (typeof questionFeedback === 'object' && questionFeedback.message) {
      return questionFeedback.message;
    }
    return questionFeedback;
  };

  // 获取节点显示信息
  const getNodeDisplayInfo = (nodeId) => {
    return nodeMap.get(nodeId) || null;
  };

  // 渲染链接节点部分
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
              <li key={index} className="linked-node-item">
                {nodeInfo ? `${nodeInfo.data.label} (${nodeInfo.projectName} / ${nodeInfo.graphName})` : `Node ${nodeId}`}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  // 渲染选择题
  const renderMultipleChoiceQuestion = (question) => {
    const userAnswer = userAnswers[question.id];
    const questionFeedback = feedback[question.id];

    return (
      <div className="question-content">
        <p>{question.question}</p>
        <div className="options">
          {question.options.map((option, index) => {
            const optionLabel = String.fromCharCode(65 + index);
            return (
              <div key={optionLabel} className="option">
                <input
                  type="radio"
                  id={`option-${optionLabel}`}
                  name={`question-${question.id}`}
                  value={optionLabel}
                  checked={userAnswer === optionLabel}
                  onChange={(e) => setUserAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
                />
                <label htmlFor={`option-${optionLabel}`}>
                  <span className="option-label">{optionLabel}.</span> {option}
                </label>
              </div>
            );
          })}
        </div>
        {renderLinkedNodes(question)}
        <div className="submit-button-container">
          <button
            className="btn btn-primary"
            onClick={handleSubmitButtonClick}
            disabled={!userAnswer}
          >
            Submit Answer
          </button>
        </div>
        {questionFeedback && (
          <div className={getFeedbackClassName(questionFeedback)}>
            <div dangerouslySetInnerHTML={renderMarkdown(getFeedbackMessage(questionFeedback))} />
          </div>
        )}
      </div>
    );
  };
  
  // 渲染填空题
  const renderFillBlankQuestion = (question) => {
    const userAnswer = userAnswers[question.id];
    const questionFeedback = feedback[question.id];

    return (
      <div className="question-content">
        <p>{question.question}</p>
        <div className="fill-blank">
          <input
            type="text"
            value={userAnswer || ''}
            onChange={(e) => setUserAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
            placeholder="Enter your answer here"
          />
        </div>
        {renderLinkedNodes(question)}
        <div className="submit-button-container">
          <button
            className="btn btn-primary"
            onClick={handleSubmitButtonClick}
            disabled={!userAnswer}
          >
            Submit Answer
          </button>
        </div>
        {questionFeedback && (
          <div className={getFeedbackClassName(questionFeedback)}>
            <div dangerouslySetInnerHTML={renderMarkdown(getFeedbackMessage(questionFeedback))} />
          </div>
        )}
      </div>
    );
  };
  
  // 渲染解答题
  const renderEssayQuestion = (question) => {
    const userAnswer = userAnswers[question.id];
    const questionFeedback = feedback[question.id];

    return (
      <div className="question-content">
        <p>{question.question}</p>
        <div className="essay">
          <textarea
            value={userAnswer || ''}
            onChange={(e) => setUserAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
            placeholder="Write your answer here"
            rows={5}
          />
        </div>
        {renderLinkedNodes(question)}
        <div className="submit-button-container">
          <button
            className="btn btn-primary"
            onClick={handleSubmitButtonClick}
            disabled={!userAnswer}
          >
            Submit Answer
          </button>
        </div>
        {questionFeedback && (
          <div className={getFeedbackClassName(questionFeedback)}>
            <div dangerouslySetInnerHTML={renderMarkdown(getFeedbackMessage(questionFeedback))} />
          </div>
        )}
      </div>
    );
  };
  
  // 渲染总结页
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
              handlePreviousQuestion();
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
  
  // 渲染问题
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

  return (
    <div className="question-container">
      <div className="question-header">
        <h4>{currentQuestionIndex === -1 ? 'Practice Summary' : `Question ${currentQuestionIndex + 1} of ${questions.length}`}</h4>
      </div>
      {renderQuestion()}
      
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
          onClick={handleNextQuestion}
          disabled={questions.length === 0}
        >
          {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default QuestionRenderer;