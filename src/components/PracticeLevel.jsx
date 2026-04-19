import React, { useState } from 'react';
import PracticeLevelStudent from './practice/PracticeLevelStudent';
import PracticeLevelCreator from './practice/PracticeLevelCreator';
import { styles } from './practice/styles';

const PracticeLevel = () => {
  // 从localStorage获取用户信息
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  // 状态管理
  const [mode, setMode] = useState('student'); // 'student' 或 'creator'
  
  return (
    <div className="practice-level">
      <div className="practice-header">
        <div className="header-left">
          <h2>Practice Level</h2>
          <div className="navigation-links">
            <a href="/" className="nav-link">Home</a>
            <a href="/input" className="nav-link">Input Level</a>
            <a href="/integration" className="nav-link">Integration Level</a>
          </div>
          <div className="user-status">
            {user ? `Logged in as: ${user.username}` : 'Not logged in'}
          </div>
        </div>
        <div className="header-right">
          <div className="mode-switcher">
            <button
              className={`mode-btn ${mode === 'student' ? 'active' : ''}`}
              onClick={() => setMode('student')}
            >
              Practice Mode
            </button>
            <button
              className={`mode-btn ${mode === 'creator' ? 'active' : ''}`}
              onClick={() => setMode('creator')}
            >
              Create Mode
            </button>
          </div>
        </div>
      </div>
      
      {mode === 'student' ? (
        <PracticeLevelStudent user={user} />
      ) : (
        <PracticeLevelCreator user={user} />
      )}
      
      <style>{styles}</style>
    </div>
  );
};

export default PracticeLevel;