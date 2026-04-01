import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

// 连接数据库
mongoose.connect('mongodb://localhost:27017/justlearnit')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// 添加用户的函数
const addUser = async (username, password) => {
  try {
    // 检查用户是否已存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('User already exists');
      return;
    }

    // 密码加密
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 创建新用户
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();
    console.log('User added successfully');
  } catch (error) {
    console.error('Error adding user:', error.message);
  } finally {
    // 关闭数据库连接
    mongoose.disconnect();
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
