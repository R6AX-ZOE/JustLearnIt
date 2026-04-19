import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// 练习数据文件路径
const PRACTICE_FILE = path.join(process.cwd(), 'practice.json');
// 集成数据文件路径
const INTEGRATION_FILE = path.join(process.cwd(), 'integration.json');

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
const executeResponseFunction = (responseFunction, question, answer, isCorrect) => {
  if (!responseFunction) return null;
  
  try {
    // 创建一个安全的执行环境
    const sandbox = {
      question,
      answer,
      isCorrect,
      Math
    };
    
    // 使用 Function 构造函数创建函数并执行
    const func = new Function('question', 'answer', 'isCorrect', 'Math', responseFunction);
    return func(question, answer, isCorrect, Math);
  } catch (error) {
    console.error('Error executing response function:', error.message);
    return null;
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

    // 如果提供了位置参数，在指定位置插入问题
    if (position !== undefined && position >= 0 && position <= practice.questions.length) {
      practiceData[projectIndex].practices[practiceIndex].questions.splice(position, 0, newQuestion);
    } else {
      // 否则添加到末尾
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

// 提交答案并获取反馈
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
      isCorrect = true; // 解答题暂时标记为正确
    }

    // 尝试执行 responseFunction 生成反馈
    if (question.responseFunction) {
      const functionFeedback = executeResponseFunction(question.responseFunction, question, answer, isCorrect);
      if (functionFeedback) {
        feedback = functionFeedback;
      } else {
        // 如果函数执行失败，使用默认反馈
        if (isCorrect) {
          feedback = 'Correct! ' + (question.feedback || 'Well done.');
        } else {
          feedback = 'Incorrect. ' + (question.feedback || 'Try again.');
        }
      }
    } else {
      // 使用默认反馈
      if (isCorrect) {
        feedback = 'Correct! ' + (question.feedback || 'Well done.');
      } else {
        feedback = 'Incorrect. ' + (question.feedback || 'Try again.');
      }
    }

    res.status(200).json({ 
      questionId: id,
      userAnswer: answer,
      isCorrect,
      feedback,
      // 标记反馈为 markdown 格式，前端需要使用 markdown 渲染器处理
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

    // 获取原有的节点链接，用于后续更新集成数据
    const oldNodes = questionObj.nodes || [];
    
    // 更新问题的节点链接
    practiceData[projectIndex].practices[practiceIndex].questions[questionIndex].nodes = nodes;
    practiceData[projectIndex].updatedAt = new Date();
    persistPractice();

    // 同步更新集成数据中对应节点的 questionLinks
    const integrationData = loadIntegration();
    let integrationUpdated = false;
    
    // 移除旧的链接
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
    
    // 添加新的链接
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
    
    // 保存集成数据
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