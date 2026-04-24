import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// 练习数据文件路径
const PRACTICE_FILE = path.join(process.cwd(), 'practice.json');
// 集成数据文件路径
const INTEGRATION_FILE = path.join(process.cwd(), 'integration.json');
// 学生进度数据文件路径
const STUDENT_PROGRESS_FILE = path.join(process.cwd(), 'studentProgress.json');

// 加载学生进度数据
const loadStudentProgress = () => {
  try {
    if (fs.existsSync(STUDENT_PROGRESS_FILE)) {
      const data = fs.readFileSync(STUDENT_PROGRESS_FILE, 'utf8');
      return JSON.parse(data);
    }
    return { inProgress: [], history: [] };
  } catch (error) {
    console.error('Error loading student progress:', error.message);
    return { inProgress: [], history: [] };
  }
};

// 保存学生进度数据
const saveStudentProgress = (progressData) => {
  try {
    fs.writeFileSync(STUDENT_PROGRESS_FILE, JSON.stringify(progressData, null, 2));
    console.log('Student progress saved to file');
  } catch (error) {
    console.error('Error saving student progress:', error.message);
  }
};

let studentProgressData = loadStudentProgress();

// 持久化学生进度
const persistStudentProgress = () => {
  saveStudentProgress(studentProgressData);
};

// 加载集成数据
const loadIntegration = () => {
  try {
    if (fs.existsSync(INTEGRATION_FILE)) {
      const data = fs.readFileSync(INTEGRATION_FILE, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading integration:', error.message);
    return [];
  }
};

// 保存集成数据
const saveIntegration = (integration) => {
  try {
    fs.writeFileSync(INTEGRATION_FILE, JSON.stringify(integration, null, 2));
    console.log('Integration saved to file');
  } catch (error) {
    console.error('Error saving integration:', error.message);
  }
};

// 加载练习数据
const loadPractice = () => {
  try {
    if (fs.existsSync(PRACTICE_FILE)) {
      const data = fs.readFileSync(PRACTICE_FILE, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading practice:', error.message);
    return [];
  }
};

// 保存练习数据
const savePractice = (practice) => {
  try {
    fs.writeFileSync(PRACTICE_FILE, JSON.stringify(practice, null, 2));
    console.log('Practice saved to file');
  } catch (error) {
    console.error('Error saving practice:', error.message);
  }
};

let practiceData = loadPractice();

const persistPractice = () => {
  savePractice(practiceData);
};

// 执行 responseFunction 生成反馈
const executeResponseFunction = (responseFunction, question, answer, isCorrect, sessionId) => {
  if (!responseFunction) return null;

  try {
    const sandbox = {
      question,
      answer,
      isCorrect,
      Math,
      sessionId,
      storage: {
        get: (key) => {
          const session = studentProgressData.inProgress.find(s => s.id === sessionId);
          return session?.pluginData?.[key];
        },
        set: (key, value) => {
          const session = studentProgressData.inProgress.find(s => s.id === sessionId);
          if (session) {
            if (!session.pluginData) session.pluginData = {};
            session.pluginData[key] = value;
            persistStudentProgress();
          }
        }
      },
      plugins: {
        execute: (pluginName, methodName, ...args) => {
          console.log(`Plugin ${pluginName}.${methodName} called with args:`, args);
          if (methodName === 'formatMessage') {
            const [isCorrectFlag, message] = args;
            return isCorrectFlag ? `✅ ${message}` : `❌ ${message}`;
          }
          if (methodName === 'getAnswer') {
            return question.correctAnswer;
          }
          return args[args.length - 1];
        }
      }
    };

    try {
      const func = new Function('question', 'answer', 'isCorrect', 'Math', 'plugins', 'sessionId', 'storage', `return ${responseFunction}`);
      return func(question, answer, isCorrect, Math, sandbox.plugins, sessionId, sandbox.storage);
    } catch (exprError) {
      try {
        const func = new Function('question', 'answer', 'isCorrect', 'Math', 'plugins', 'sessionId', 'storage', responseFunction);
        return func(question, answer, isCorrect, Math, sandbox.plugins, sessionId, sandbox.storage);
      } catch (funcError) {
        throw new Error(`Both expression and function execution failed: ${exprError.message} | ${funcError.message}`);
      }
    }
  } catch (error) {
    console.error('Error executing response function:', error.message);
    return `Error: ${error.message}`;
  }
};

// 获取所有项目
router.get('/projects', (req, res) => {
  try {
    res.status(200).json({ projects: practiceData });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 获取用户的所有项目
router.get('/projects/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const userProjects = practiceData.filter(project => project.userId === userId);
    res.status(200).json({ projects: userProjects });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 获取用户的所有项目（基本信息）
router.get('/projects/:userId/basic', (req, res) => {
  try {
    const { userId } = req.params;
    const userProjects = practiceData.filter(project => project.userId === userId);
    const basicProjects = userProjects.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      userId: project.userId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    }));
    res.status(200).json({ projects: basicProjects });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 获取单个项目
router.get('/project/:id', (req, res) => {
  try {
    const { id } = req.params;
    const project = practiceData.find(project => project.id === id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json({ project });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 创建新项目
router.post('/projects', (req, res) => {
  try {
    const { name, description, userId } = req.body;
    if (!name || !userId) {
      return res.status(400).json({ message: 'Name and userId are required' });
    }

    const newProject = {
      id: Date.now().toString(),
      name,
      description: description || '',
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      practices: []
    };

    practiceData.push(newProject);
    persistPractice();
    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 更新项目
router.put('/project/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, practices } = req.body;

    const projectIndex = practiceData.findIndex(project => project.id === id);
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (name !== undefined) practiceData[projectIndex].name = name;
    if (description !== undefined) practiceData[projectIndex].description = description;
    if (practices !== undefined) practiceData[projectIndex].practices = practices;

    practiceData[projectIndex].updatedAt = new Date();
    persistPractice();

    res.status(200).json({ message: 'Project updated successfully', project: practiceData[projectIndex] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 删除项目
router.delete('/project/:id', (req, res) => {
  try {
    const { id } = req.params;
    const projectIndex = practiceData.findIndex(project => project.id === id);

    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }

    practiceData.splice(projectIndex, 1);
    persistPractice();
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 获取项目的所有练习
router.get('/project/:projectId/practices', (req, res) => {
  try {
    const { projectId } = req.params;
    const project = practiceData.find(project => project.id === projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ practices: project.practices || [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 获取单个练习
router.get('/practice/:id', (req, res) => {
  try {
    const { id } = req.params;
    let practice = null;

    for (const project of practiceData) {
      const foundPractice = project.practices?.find(p => p.id === id);
      if (foundPractice) {
        practice = foundPractice;
        break;
      }
    }

    if (!practice) {
      return res.status(404).json({ message: 'Practice not found' });
    }

    res.status(200).json({ practice });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 创建新练习
router.post('/project/:projectId/practices', (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const project = practiceData.find(project => project.id === projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const newPractice = {
      id: Date.now().toString(),
      name,
      description: description || '',
      questions: []
    };

    if (!project.practices) {
      project.practices = [];
    }

    project.practices.push(newPractice);
    project.updatedAt = new Date();
    persistPractice();

    res.status(201).json({
      message: 'Practice created successfully',
      project,
      practice: newPractice
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 更新练习
router.put('/practice/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, questions } = req.body;

    let practice = null;
    let projectIndex = -1;
    let practiceIndex = -1;

    for (let i = 0; i < practiceData.length; i++) {
      const project = practiceData[i];
      const index = project.practices?.findIndex(p => p.id === id);
      if (index !== undefined && index !== -1) {
        practice = project.practices[index];
        projectIndex = i;
        practiceIndex = index;
        break;
      }
    }

    if (!practice) {
      return res.status(404).json({ message: 'Practice not found' });
    }

    if (name !== undefined) practiceData[projectIndex].practices[practiceIndex].name = name;
    if (description !== undefined) practiceData[projectIndex].practices[practiceIndex].description = description;
    if (questions !== undefined) practiceData[projectIndex].practices[practiceIndex].questions = questions;

    practiceData[projectIndex].updatedAt = new Date();
    persistPractice();

    res.status(200).json({
      message: 'Practice updated successfully',
      project: practiceData[projectIndex],
      practice: practiceData[projectIndex].practices[practiceIndex]
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 删除练习
router.delete('/practice/:id', (req, res) => {
  try {
    const { id } = req.params;
    let projectIndex = -1;
    let practiceIndex = -1;

    for (let i = 0; i < practiceData.length; i++) {
      const project = practiceData[i];
      const index = project.practices?.findIndex(p => p.id === id);
      if (index !== undefined && index !== -1) {
        projectIndex = i;
        practiceIndex = index;
        break;
      }
    }

    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Practice not found' });
    }

    practiceData[projectIndex].practices.splice(practiceIndex, 1);
    practiceData[projectIndex].updatedAt = new Date();
    persistPractice();

    res.status(200).json({
      message: 'Practice deleted successfully',
      project: practiceData[projectIndex]
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 获取练习的所有问题
router.get('/practice/:practiceId/questions', (req, res) => {
  try {
    const { practiceId } = req.params;
    let practice = null;

    for (const project of practiceData) {
      const foundPractice = project.practices?.find(p => p.id === practiceId);
      if (foundPractice) {
        practice = foundPractice;
        break;
      }
    }

    if (!practice) {
      return res.status(404).json({ message: 'Practice not found' });
    }

    res.status(200).json({ questions: practice.questions || [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 获取单个问题
router.get('/question/:id', (req, res) => {
  try {
    const { id } = req.params;
    let question = null;

    for (const project of practiceData) {
      for (const practice of project.practices || []) {
        const foundQuestion = practice.questions?.find(q => q.id === id);
        if (foundQuestion) {
          question = foundQuestion;
          break;
        }
      }
      if (question) break;
    }

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json({ question });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 创建新问题
router.post('/practice/:practiceId/questions', (req, res) => {
  try {
    const { practiceId } = req.params;
    const { type, question, options, correctAnswer, feedback, responseFunction, position } = req.body;

    if (!type || !question) {
      return res.status(400).json({ message: 'Type and question are required' });
    }

    let practice = null;
    let projectIndex = -1;
    let practiceIndex = -1;

    for (let i = 0; i < practiceData.length; i++) {
      const project = practiceData[i];
      const index = project.practices?.findIndex(p => p.id === practiceId);
      if (index !== undefined && index !== -1) {
        practice = project.practices[index];
        projectIndex = i;
        practiceIndex = index;
        break;
      }
    }

    if (!practice) {
      return res.status(404).json({ message: 'Practice not found' });
    }

    const newQuestion = {
      id: Date.now().toString(),
      type,
      question,
      options: options || [],
      correctAnswer: correctAnswer || '',
      feedback: feedback || '',
      responseFunction: responseFunction || ''
    };

    if (!practice.questions) {
      practice.questions = [];
    }

    if (position !== undefined && position >= 0 && position <= practice.questions.length) {
      practiceData[projectIndex].practices[practiceIndex].questions.splice(position, 0, newQuestion);
    } else {
      practiceData[projectIndex].practices[practiceIndex].questions.push(newQuestion);
    }

    practiceData[projectIndex].updatedAt = new Date();
    persistPractice();

    res.status(201).json({
      message: 'Question created successfully',
      question: newQuestion
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 更新问题
router.put('/question/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { type, question, options, correctAnswer, feedback, responseFunction } = req.body;

    let questionObj = null;
    let projectIndex = -1;
    let practiceIndex = -1;
    let questionIndex = -1;

    for (let i = 0; i < practiceData.length; i++) {
      const project = practiceData[i];
      for (let j = 0; j < (project.practices?.length || 0); j++) {
        const practice = project.practices[j];
        const index = practice.questions?.findIndex(q => q.id === id);
        if (index !== undefined && index !== -1) {
          questionObj = practice.questions[index];
          projectIndex = i;
          practiceIndex = j;
          questionIndex = index;
          break;
        }
      }
      if (questionObj) break;
    }

    if (!questionObj) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (type !== undefined) practiceData[projectIndex].practices[practiceIndex].questions[questionIndex].type = type;
    if (question !== undefined) practiceData[projectIndex].practices[practiceIndex].questions[questionIndex].question = question;
    if (options !== undefined) practiceData[projectIndex].practices[practiceIndex].questions[questionIndex].options = options;
    if (correctAnswer !== undefined) practiceData[projectIndex].practices[practiceIndex].questions[questionIndex].correctAnswer = correctAnswer;
    if (feedback !== undefined) practiceData[projectIndex].practices[practiceIndex].questions[questionIndex].feedback = feedback;
    if (responseFunction !== undefined) practiceData[projectIndex].practices[practiceIndex].questions[questionIndex].responseFunction = responseFunction;

    practiceData[projectIndex].updatedAt = new Date();
    persistPractice();

    res.status(200).json({
      message: 'Question updated successfully',
      question: practiceData[projectIndex].practices[practiceIndex].questions[questionIndex]
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 删除问题
router.delete('/question/:id', (req, res) => {
  try {
    const { id } = req.params;
    let projectIndex = -1;
    let practiceIndex = -1;
    let questionIndex = -1;

    for (let i = 0; i < practiceData.length; i++) {
      const project = practiceData[i];
      for (let j = 0; j < (project.practices?.length || 0); j++) {
        const practice = project.practices[j];
        const index = practice.questions?.findIndex(q => q.id === id);
        if (index !== undefined && index !== -1) {
          projectIndex = i;
          practiceIndex = j;
          questionIndex = index;
          break;
        }
      }
      if (projectIndex !== -1) break;
    }

    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Question not found' });
    }

    practiceData[projectIndex].practices[practiceIndex].questions.splice(questionIndex, 1);
    practiceData[projectIndex].updatedAt = new Date();
    persistPractice();

    res.status(200).json({
      message: 'Question deleted successfully',
      project: practiceData[projectIndex]
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 获取学生未完成的练习
router.get('/student/:userId/in-progress', (req, res) => {
  try {
    const { userId } = req.params;
    const userSessions = studentProgressData.inProgress.filter(s => s.userId === userId);
    res.status(200).json({ sessions: userSessions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 获取学生历史记录
router.get('/student/:userId/history', (req, res) => {
  try {
    const { userId } = req.params;
    const userHistory = studentProgressData.history.filter(h => h.userId === userId);
    res.status(200).json({ history: userHistory });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 开始新的练习会话
router.post('/student/:userId/session', (req, res) => {
  try {
    const { userId } = req.params;
    const { practiceId, sourceQuestions } = req.body;

    if (!practiceId) {
      return res.status(400).json({ message: 'Practice ID is required' });
    }

    let practice = null;
    for (const project of practiceData) {
      const foundPractice = project.practices?.find(p => p.id === practiceId);
      if (foundPractice) {
        practice = foundPractice;
        break;
      }
    }

    if (!practice) {
      return res.status(404).json({ message: 'Practice not found' });
    }

    let questions = [];
    if (sourceQuestions && sourceQuestions.length > 0) {
      questions = sourceQuestions;
    } else {
      questions = [...(practice.questions || [])];
    }

    if (questions.length === 0) {
      return res.status(400).json({ message: 'No questions available in this practice' });
    }

    const session = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      practiceId,
      practiceName: practice.name,
      questions,
      currentQuestionIndex: 0,
      answers: {},
      startTime: new Date(),
      lastActivityTime: new Date(),
      status: 'in_progress',
      score: null,
      totalQuestions: questions.length,
      pluginData: {}
    };

    studentProgressData.inProgress.push(session);
    persistStudentProgress();

    res.status(201).json({
      message: 'Session started successfully',
      session: session
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 获取会话详情
router.get('/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = studentProgressData.inProgress.find(s => s.id === sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.status(200).json({ session });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 获取会话当前题目（无答案预览）
router.get('/session/:sessionId/preview', (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = studentProgressData.inProgress.find(s => s.id === sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const previewQuestions = session.questions.slice(0, 2).map(q => ({
      id: q.id,
      type: q.type,
      question: q.question,
      options: q.options,
      nodes: q.nodes
    }));

    res.status(200).json({
      sessionId: session.id,
      practiceName: session.practiceName,
      totalQuestions: session.totalQuestions,
      previewQuestions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 获取会话的起始页信息
router.get('/session/:sessionId/start', (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = studentProgressData.inProgress.find(s => s.id === sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.status(200).json({
      sessionId: session.id,
      practiceName: session.practiceName,
      totalQuestions: session.totalQuestions,
      startTime: session.startTime,
      currentQuestionIndex: session.currentQuestionIndex
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 提交答案并获取反馈
router.post('/session/:sessionId/submit', (req, res) => {
  try {
    const { sessionId } = req.params;
    const { answer } = req.body;

    if (answer === undefined) {
      return res.status(400).json({ message: 'Answer is required' });
    }

    const sessionIndex = studentProgressData.inProgress.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const session = studentProgressData.inProgress[sessionIndex];
    const currentQuestion = session.questions[session.currentQuestionIndex];

    if (!currentQuestion) {
      return res.status(400).json({ message: 'No current question' });
    }

    let feedback = '';
    let isCorrect = false;

    if (currentQuestion.type === 'multiple-choice') {
      isCorrect = answer === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === 'fill-blank') {
      isCorrect = answer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
    } else if (currentQuestion.type === 'essay') {
      isCorrect = true;
    }

    if (currentQuestion.responseFunction) {
      const functionFeedback = executeResponseFunction(currentQuestion.responseFunction, currentQuestion, answer, isCorrect, sessionId);
      feedback = functionFeedback || 'Feedback generation failed';
    } else {
      feedback = isCorrect ? 'Correct' : 'Incorrect';
    }

    session.answers[currentQuestion.id] = {
      answer,
      isCorrect,
      feedback,
      submittedAt: new Date()
    };
    session.lastActivityTime = new Date();
    persistStudentProgress();

    res.status(200).json({
      questionId: currentQuestion.id,
      userAnswer: answer,
      isCorrect,
      feedback,
      isMarkdown: true,
      currentQuestionIndex: session.currentQuestionIndex,
      totalQuestions: session.totalQuestions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 下一题
router.post('/session/:sessionId/next', (req, res) => {
  try {
    const { sessionId } = req.params;

    const sessionIndex = studentProgressData.inProgress.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const session = studentProgressData.inProgress[sessionIndex];

    if (session.currentQuestionIndex < session.totalQuestions - 1) {
      session.currentQuestionIndex++;
      session.lastActivityTime = new Date();
      persistStudentProgress();

      const nextQuestion = session.questions[session.currentQuestionIndex];
      res.status(200).json({
        currentQuestionIndex: session.currentQuestionIndex,
        question: {
          id: nextQuestion.id,
          type: nextQuestion.type,
          question: nextQuestion.question,
          options: nextQuestion.options,
          nodes: nextQuestion.nodes
        },
        hasAnswered: !!session.answers[nextQuestion.id]
      });
    } else {
      res.status(200).json({
        message: 'All questions completed',
        currentQuestionIndex: session.currentQuestionIndex,
        isLastQuestion: true
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 完成会话
router.post('/session/:sessionId/complete', (req, res) => {
  try {
    const { sessionId } = req.params;

    const sessionIndex = studentProgressData.inProgress.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const session = studentProgressData.inProgress[sessionIndex];
    const totalQuestions = session.totalQuestions;
    const correctCount = Object.values(session.answers).filter(a => a.isCorrect).length;
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const historyEntry = {
      id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: session.userId,
      sessionId: session.id,
      practiceId: session.practiceId,
      practiceName: session.practiceName,
      questions: session.questions,
      answers: session.answers,
      score,
      correctCount,
      totalQuestions,
      startTime: session.startTime,
      endTime: new Date(),
      completedAt: new Date()
    };

    studentProgressData.history.push(historyEntry);
    studentProgressData.inProgress.splice(sessionIndex, 1);
    persistStudentProgress();

    res.status(200).json({
      message: 'Session completed successfully',
      summary: {
        score,
        correctCount,
        totalQuestions,
        practiceName: session.practiceName
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 获取会话结束页信息
router.get('/session/:sessionId/end', (req, res) => {
  try {
    const { sessionId } = req.params;

    const history = studentProgressData.history.find(h => h.sessionId === sessionId);
    if (!history) {
      return res.status(404).json({ message: 'Session history not found' });
    }

    res.status(200).json({
      sessionId: history.sessionId,
      practiceName: history.practiceName,
      score: history.score,
      correctCount: history.correctCount,
      totalQuestions: history.totalQuestions,
      completedAt: history.completedAt,
      questions: history.questions,
      answers: history.answers
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 删除历史记录
router.delete('/student/:userId/history/:historyId', (req, res) => {
  try {
    const { userId, historyId } = req.params;

    const historyIndex = studentProgressData.history.findIndex(h => h.id === historyId && h.userId === userId);
    if (historyIndex === -1) {
      return res.status(404).json({ message: 'History entry not found' });
    }

    studentProgressData.history.splice(historyIndex, 1);
    persistStudentProgress();

    res.status(200).json({ message: 'History entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 删除in-progress记录
router.delete('/student/:userId/in-progress/:sessionId', (req, res) => {
  try {
    const { userId, sessionId } = req.params;

    const sessionIndex = studentProgressData.inProgress.findIndex(s => s.id === sessionId && s.userId === userId);
    if (sessionIndex === -1) {
      return res.status(404).json({ message: 'Session not found' });
    }

    studentProgressData.inProgress.splice(sessionIndex, 1);
    persistStudentProgress();

    res.status(200).json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 获取错题
router.get('/student/:userId/incorrect-questions', (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;
    // 获取多个practiceId参数
    const practiceIds = req.query.practiceId ? 
      (Array.isArray(req.query.practiceId) ? req.query.practiceId : [req.query.practiceId]) : 
      [];

    const incorrectQuestions = [];

    for (const history of studentProgressData.history) {
      if (history.userId === userId) {
        if (practiceIds.length === 0 || practiceIds.includes(history.practiceId)) {
          for (const [questionId, answer] of Object.entries(history.answers)) {
            if (!answer.isCorrect) {
              // 检查时间范围
              const submittedDate = new Date(answer.submittedAt);
              let withinDateRange = true;
              
              if (startDate) {
                // 解析为本地时间的开始
                const start = new Date(startDate);
                // 确保比较时只比较日期部分，忽略时间
                const submittedDateOnly = new Date(submittedDate.getFullYear(), submittedDate.getMonth(), submittedDate.getDate());
                const startDateOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
                withinDateRange = withinDateRange && submittedDateOnly >= startDateOnly;
              }
              
              if (endDate) {
                // 解析为本地时间的结束
                const end = new Date(endDate);
                // 确保比较时只比较日期部分，忽略时间
                const submittedDateOnly = new Date(submittedDate.getFullYear(), submittedDate.getMonth(), submittedDate.getDate());
                const endDateOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate());
                withinDateRange = withinDateRange && submittedDateOnly <= endDateOnly;
              }
              
              if (withinDateRange) {
                const question = history.questions.find(q => q.id === questionId);
                if (question) {
                  incorrectQuestions.push({
                    question,
                    userAnswer: answer.answer,
                    feedback: answer.feedback,
                    practiceId: history.practiceId,
                    practiceName: history.practiceName,
                    submittedAt: answer.submittedAt,
                    sessionId: history.sessionId
                  });
                }
              }
            }
          }
        }
      }
    }

    res.status(200).json({ incorrectQuestions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 创建错题题单会话
router.post('/student/:userId/review-session', (req, res) => {
  try {
    const { userId } = req.params;
    const { questionIds, practiceId, practiceName } = req.body;

    if (!questionIds || questionIds.length === 0) {
      return res.status(400).json({ message: 'Question IDs are required' });
    }

    // 收集所有历史记录中的错题
    const allIncorrectQuestions = [];
    for (const history of studentProgressData.history) {
      if (history.userId === userId) {
        for (const [questionId, answer] of Object.entries(history.answers)) {
          if (!answer.isCorrect) {
            const question = history.questions.find(q => q.id === questionId);
            if (question) {
              allIncorrectQuestions.push({
                question,
                userAnswer: answer.answer,
                feedback: answer.feedback,
                practiceId: history.practiceId,
                practiceName: history.practiceName,
                submittedAt: answer.submittedAt,
                sessionId: history.sessionId
              });
            }
          }
        }
      }
    }

    // 筛选用户选择的错题
    const selectedQuestions = allIncorrectQuestions
      .filter(item => questionIds.includes(item.question.id))
      .map(item => item.question);

    if (selectedQuestions.length === 0) {
      return res.status(400).json({ message: 'No valid questions found' });
    }

    const session = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      practiceId: practiceId || 'review',
      practiceName: practiceName || 'Review Session',
      questions: selectedQuestions,
      currentQuestionIndex: 0,
      answers: {},
      startTime: new Date(),
      lastActivityTime: new Date(),
      status: 'in_progress',
      score: null,
      totalQuestions: selectedQuestions.length,
      pluginData: {}
    };

    studentProgressData.inProgress.push(session);
    persistStudentProgress();

    res.status(201).json({
      message: 'Review session started successfully',
      session: session
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 提交答案并获取反馈（旧接口，保留兼容性）
router.post('/question/:id/submit', (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    if (!answer) {
      return res.status(400).json({ message: 'Answer is required' });
    }

    let question = null;

    for (const project of practiceData) {
      for (const practice of project.practices || []) {
        const foundQuestion = practice.questions?.find(q => q.id === id);
        if (foundQuestion) {
          question = foundQuestion;
          break;
        }
      }
      if (question) break;
    }

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    let feedback = '';
    let isCorrect = false;

    if (question.type === 'multiple-choice') {
      isCorrect = answer === question.correctAnswer;
    } else if (question.type === 'fill-blank') {
      isCorrect = answer.toLowerCase() === question.correctAnswer.toLowerCase();
    } else if (question.type === 'essay') {
      isCorrect = true;
    }

    if (question.responseFunction) {
      const functionFeedback = executeResponseFunction(question.responseFunction, question, answer, isCorrect, null);
      feedback = functionFeedback || 'Feedback generation failed';
    } else {
      feedback = isCorrect ? 'Correct' : 'Incorrect';
    }

    res.status(200).json({
      questionId: id,
      userAnswer: answer,
      isCorrect,
      feedback,
      isMarkdown: true
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 获取问题的关联节点
router.get('/question/:id/nodes', (req, res) => {
  try {
    const { id } = req.params;
    let question = null;

    for (const project of practiceData) {
      for (const practice of project.practices || []) {
        const foundQuestion = practice.questions?.find(q => q.id === id);
        if (foundQuestion) {
          question = foundQuestion;
          break;
        }
      }
      if (question) break;
    }

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json({
      questionId: id,
      nodes: question.nodes || []
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 更新问题的关联节点
router.put('/question/:id/nodes', (req, res) => {
  try {
    const { id } = req.params;
    const { nodes } = req.body;

    let questionObj = null;
    let projectIndex = -1;
    let practiceIndex = -1;
    let questionIndex = -1;

    for (let i = 0; i < practiceData.length; i++) {
      const project = practiceData[i];
      for (let j = 0; j < (project.practices?.length || 0); j++) {
        const practice = project.practices[j];
        const index = practice.questions?.findIndex(q => q.id === id);
        if (index !== undefined && index !== -1) {
          questionObj = practice.questions[index];
          projectIndex = i;
          practiceIndex = j;
          questionIndex = index;
          break;
        }
      }
      if (questionObj) break;
    }

    if (!questionObj) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const oldNodes = questionObj.nodes || [];

    practiceData[projectIndex].practices[practiceIndex].questions[questionIndex].nodes = nodes;
    practiceData[projectIndex].updatedAt = new Date();
    persistPractice();

    const integrationData = loadIntegration();
    let integrationUpdated = false;

    for (const oldNodeId of oldNodes) {
      for (const project of integrationData) {
        for (const graph of project.graphs || []) {
          for (const node of graph.nodes || []) {
            if (node.id === oldNodeId) {
              node.data.questionLinks = (node.data.questionLinks || []).filter(questionLinkId => questionLinkId !== id);
              integrationUpdated = true;
            }
          }
        }
      }
    }

    for (const newNodeId of nodes) {
      for (const project of integrationData) {
        for (const graph of project.graphs || []) {
          for (const node of graph.nodes || []) {
            if (node.id === newNodeId) {
              if (!node.data.questionLinks) {
                node.data.questionLinks = [];
              }
              if (!node.data.questionLinks.includes(id)) {
                node.data.questionLinks.push(id);
                integrationUpdated = true;
              }
            }
          }
        }
      }
    }

    if (integrationUpdated) {
      saveIntegration(integrationData);
    }

    res.status(200).json({
      message: 'Question nodes updated successfully',
      question: practiceData[projectIndex].practices[practiceIndex].questions[questionIndex]
    });
  } catch (error) {
    console.error('Error updating question nodes:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
