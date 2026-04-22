import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';
import PracticeLevelStudent from './practice/PracticeLevelStudent';
import PracticeLevelCreator from './practice/PracticeLevelCreator';
import { styles } from './practice/styles';

const PracticeLevel = ({ defaultMode = 'student' }) => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [mode, setMode] = useState(() => {
    const path = location.pathname;
    if (path.includes('/creator')) return 'creator';
    return 'student';
  });

  const [selectedProjectId, setSelectedProjectId] = useState(params.projectId || null);
  const [selectedPracticeId, setSelectedPracticeId] = useState(params.practiceId || null);
  const [questionIndex, setQuestionIndex] = useState(() => {
    const qIndex = searchParams.get('q');
    return qIndex !== null ? parseInt(qIndex, 10) : null;
  });

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/creator')) {
      setMode('creator');
    } else {
      setMode('student');
    }
  }, [location.pathname]);

  useEffect(() => {
    setSelectedProjectId(params.projectId || null);
    setSelectedPracticeId(params.practiceId || null);
  }, [params.projectId, params.practiceId]);

  useEffect(() => {
    const qIndex = searchParams.get('q');
    setQuestionIndex(qIndex !== null ? parseInt(qIndex, 10) : null);
  }, [searchParams]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setSelectedProjectId(null);
    setSelectedPracticeId(null);
    if (newMode === 'student') {
      navigate('/practice/student');
    } else {
      navigate('/practice/creator');
    }
  };

  const handleSelectionChange = (projectId, practiceId, qIndex) => {
    setSelectedProjectId(projectId);
    setSelectedPracticeId(practiceId);
    if (qIndex !== undefined) {
      setQuestionIndex(qIndex);
    }

    if (mode === 'student') {
      if (projectId && practiceId) {
        let url = `/practice/student/${projectId}/${practiceId}`;
        if (qIndex !== undefined) {
          url += `?q=${qIndex}`;
        }
        navigate(url);
      } else if (projectId) {
        navigate(`/practice/student/${projectId}`);
      } else {
        navigate('/practice/student');
      }
    } else {
      if (projectId && practiceId) {
        let url = `/practice/creator/${projectId}/${practiceId}`;
        if (qIndex !== undefined) {
          url += `?q=${qIndex}`;
        }
        navigate(url);
      } else if (projectId) {
        navigate(`/practice/creator/${projectId}`);
      } else {
        navigate('/practice/creator');
      }
    }
  };

  const handleQuestionChange = (index) => {
    setQuestionIndex(index);
    if (selectedProjectId && selectedPracticeId) {
      if (index !== null) {
        setSearchParams({ q: index });
      } else {
        setSearchParams({});
      }
    }
  };

  return (
    <div className="practice-level">
      <div className="practice-header">
        <div className="header-left">
          <h2>Practice Level</h2>
          <div className="navigation-links">
            <a href="/" className="nav-link">Home</a>
            <a href="/integration" className="nav-link">Integration Level</a>
          </div>
        </div>
        <div className="header-right">
          <div className="mode-switcher">
            <button
              className={`mode-btn ${mode === 'student' ? 'active' : ''}`}
              onClick={() => handleModeChange('student')}
            >
              Practice Mode
            </button>
            <button
              className={`mode-btn ${mode === 'creator' ? 'active' : ''}`}
              onClick={() => handleModeChange('creator')}
            >
              Create Mode
            </button>
          </div>
        </div>
      </div>

      {mode === 'student' ? (
        <PracticeLevelStudent
          selectedProjectId={selectedProjectId}
          selectedPracticeId={selectedPracticeId}
          questionIndex={questionIndex}
          onSelectionChange={handleSelectionChange}
          onQuestionChange={handleQuestionChange}
        />
      ) : (
        <PracticeLevelCreator
          selectedProjectId={selectedProjectId}
          selectedPracticeId={selectedPracticeId}
          questionIndex={questionIndex}
          onSelectionChange={handleSelectionChange}
          onQuestionChange={handleQuestionChange}
        />
      )}

      <style>{styles}</style>
    </div>
  );
};

export default PracticeLevel;
