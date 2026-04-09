import React from 'react';
import { Link } from 'react-router-dom';

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
        <div className="nav-menu">
          <Link to="/" className="nav-link active">Home</Link>
          <Link to="/learning" className="nav-link">Learning Projects</Link>
        </div>
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

      <style jsx>{`
        .nav-menu {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 10px;
        }

        .nav-link {
          padding: 10px 15px;
          text-decoration: none;
          color: #666;
          border-radius: 4px 4px 0 0;
        }

        .nav-link:hover {
          color: #333;
          background-color: #f5f5f5;
        }

        .nav-link.active {
          color: #2196F3;
          font-weight: bold;
          border-bottom: 2px solid #2196F3;
        }
      `}</style>
    </div>
  );
};

export default Home;
