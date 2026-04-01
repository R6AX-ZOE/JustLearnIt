import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

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

// 添加用户的函数
const addUser = async (username, password) => {
  try {
    // 加载现有用户
    const users = loadUsers();
    
    // 检查用户是否已存在
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      console.log('User already exists');
      return;
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
    console.log('Current users:', users);
  } catch (error) {
    console.error('Error adding user:', error.message);
  }
};

// 获取命令行参数
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.log('Usage: node addUser.js <username> <password>');
  process.exit(1);
}

const [username, password] = args;
addUser(username, password);
