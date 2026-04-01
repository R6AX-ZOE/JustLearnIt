import React from 'react';

const Home = () => {
  // 从localStorage获取用户信息
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    // 清除localStorage中的token和user信息
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // 重定向到登录页面
    window.location.href = '/login';
  };

  return (
    <div className="home-container">
      <div className="header">
        <h1>Welcome to JustLearnIt</h1>
        <div className="user-info">
          <span>Hello, {user?.username || 'User'}</span>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>
      
      <div className="main-content">
        <section className="dashboard">
          <h2>Your Learning Dashboard</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Study Time</h3>
              <p>{user?.learningStats?.totalStudyTime || 0} minutes</p>
            </div>
            <div className="stat-card">
              <h3>Completed Courses</h3>
              <p>{user?.learningStats?.completedCourses || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Current Streak</h3>
              <p>{user?.learningStats?.streak || 0} days</p>
            </div>
          </div>
        </section>

        <section className="features">
          <h2>Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>AI-Powered Learning</h3>
              <p>Import your study materials and let AI help you learn</p>
            </div>
            <div className="feature-card">
              <h3>Custom Quizzes</h3>
              <p>Generate quizzes based on your study materials</p>
            </div>
            <div className="feature-card">
              <h3>Daily Check-ins</h3>
              <p>Maintain your learning streak with daily check-ins</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
