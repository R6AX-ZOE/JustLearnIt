import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Home from './components/Home';
import LearningProjects from './components/LearningProjects';
import IntegrationLevel from './components/IntegrationLevel';
import PracticeLevel from './components/PracticeLevel';
import PracticeLevelStudentHome from './components/practice/PracticeLevelStudentHome';
import PracticeLevelStudentSession from './components/practice/PracticeLevelStudentSession';
import './App.css';

const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/input" element={
            <ProtectedRoute>
              <LearningProjects />
            </ProtectedRoute>
          } />
          <Route path="/input/:projectId" element={
            <ProtectedRoute>
              <LearningProjects />
            </ProtectedRoute>
          } />
          <Route path="/input/:projectId/:directoryId/:contentId" element={
            <ProtectedRoute>
              <LearningProjects />
            </ProtectedRoute>
          } />
          <Route path="/input/:projectId/:directoryId" element={
            <ProtectedRoute>
              <LearningProjects />
            </ProtectedRoute>
          } />
          <Route path="/integration" element={
            <ProtectedRoute>
              <IntegrationLevel />
            </ProtectedRoute>
          } />
          <Route path="/integration/:projectId" element={
            <ProtectedRoute>
              <IntegrationLevel />
            </ProtectedRoute>
          } />
          <Route path="/integration/:projectId/:graphId" element={
            <ProtectedRoute>
              <IntegrationLevel />
            </ProtectedRoute>
          } />
          <Route path="/integration/:projectId/:graphId/:nodeId" element={
            <ProtectedRoute>
              <IntegrationLevel />
            </ProtectedRoute>
          } />
          <Route path="/practice" element={
            <ProtectedRoute>
              <PracticeLevel />
            </ProtectedRoute>
          } />
          <Route path="/practice/student" element={
            <ProtectedRoute>
              <PracticeLevelStudentHome />
            </ProtectedRoute>
          } />
          <Route path="/practice/student/session/:sessionId" element={
            <ProtectedRoute>
              <PracticeLevelStudentSession mode="start" />
            </ProtectedRoute>
          } />
          <Route path="/practice/student/session/:sessionId/practice" element={
            <ProtectedRoute>
              <PracticeLevelStudentSession mode="practice" />
            </ProtectedRoute>
          } />
          <Route path="/practice/student/session/:sessionId/end" element={
            <ProtectedRoute>
              <PracticeLevelStudentSession mode="end" />
            </ProtectedRoute>
          } />
          <Route path="/practice/creator" element={
            <ProtectedRoute>
              <PracticeLevel defaultMode="creator" />
            </ProtectedRoute>
          } />
          <Route path="/practice/creator/:projectId" element={
            <ProtectedRoute>
              <PracticeLevel defaultMode="creator" />
            </ProtectedRoute>
          } />
          <Route path="/practice/creator/:projectId/:practiceId" element={
            <ProtectedRoute>
              <PracticeLevel defaultMode="creator" />
            </ProtectedRoute>
          } />

          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
