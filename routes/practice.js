import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// 练习数据文件路径
const PRACTICE_FILE = path.join(process.cwd(), 'practice.json');

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

// 获取所有项目
router.get('/projects', (req, res) => {
  try {
    res.status(200).json({ projects: practiceData });
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
    const { type, question, options, correctAnswer, feedback } = req.body;
    
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
      feedback: feedback || ''
    };

    if (!practice.questions) {
      practice.questions = [];
    }

    practiceData[projectIndex].practices[practiceIndex].questions.push(newQuestion);
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
    const { type, question, options, correctAnswer, feedback } = req.body;
    
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

export default router;