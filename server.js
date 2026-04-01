import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(express.json());

// 根路径路由
app.get('/', (req, res) => {
  res.json({ message: 'JustLearnIt API Server', users });
});

// 内存存储用户数据（用于测试）
const users = [];

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
