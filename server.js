import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import learningRoutes from './routes/learning.js';
import uploadRoutes from './routes/upload.js';
import integrationRoutes from './routes/integration.js';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(express.json());

// 添加请求日志中间件
app.use((req, res, next) => {
  console.log(`\n=== ${new Date().toISOString()} ===`);
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  next();
});

// 用户数据文件路径
const USERS_FILE = path.join(process.cwd(), 'users.json');

// 加载用户数据
const loadUsers = () => {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading users:', error.message);
    return [];
  }
};

// 保存用户数据
const saveUsers = (users) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    console.log('Users saved to file');
  } catch (error) {
    console.error('Error saving users:', error.message);
  }
};

// 加载用户数据
const users = loadUsers();

// 学习项目路由
app.use('/api/learning', learningRoutes);

// Integration层级路由
app.use('/api/integration', integrationRoutes);

// 图片上传路由
app.use('/api/upload', uploadRoutes);

// 静态文件服务 - 提供uploads目录中的图片
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// 根路径路由
app.get('/', (req, res) => {
  res.json({ message: 'JustLearnIt API Server', users });
});

// 登录路由
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 检查用户是否存在
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // 更新用户的最后登录时间
    user.lastLogin = new Date();
    // 保存用户数据到文件
    saveUsers(users);

    // 生成JWT令牌
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 添加用户的路由（仅用于服务器端手动添加）
app.post('/api/add-user', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 检查用户是否已存在
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 密码加密
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 创建新用户
    const newUser = {
      id: Date.now().toString(),
      username,
      password: hashedPassword,
      createdAt: new Date(),
      lastLogin: new Date(),
      learningStats: {
        totalStudyTime: 0,
        completedCourses: 0,
        streak: 0,
        lastStudyDate: null,
      },
    };

    users.push(newUser);
    // 保存用户数据到文件
    saveUsers(users);
    console.log('User added successfully:', newUser);
    res.status(201).json({ message: 'User added successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Memory storage initialized. Users:', users);
});
