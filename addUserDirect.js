import bcrypt from 'bcryptjs';

const users = [];

const addUser = async (username, password) => {
  try {
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
    console.log('User added successfully:', newUser);
    console.log('Current users:', users);
  } catch (error) {
    console.error('Error adding user:', error.message);
  }
};

// 获取命令行参数
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.log('Usage: node addUserDirect.js <username> <password>');
  process.exit(1);
}

const [username, password] = args;
addUser(username, password);
