import React from 'react';
import { Link } from 'react-router-dom';

const IntegrationLevel = () => {
  return (
    <div className="integration-level">
      <div className="integration-header">
        <h2>Integration Level</h2>
        <div className="navigation-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/input" className="nav-link">Input Level</Link>
        </div>
      </div>
      
      <div className="empty-state">
        <div className="empty-icon">🔄</div>
        <h3>Integration Level</h3>
        <p>This page is under construction. Here you will be able to integrate your learning inputs and create connections between different concepts.</p>
        <div className="empty-actions">
          <Link to="/" className="btn btn-primary">Go to Home</Link>
          <Link to="/input" className="btn btn-secondary">Go to Input Level</Link>
        </div>
      </div>
      
      <style>{`
        .integration-level {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          min-height: 80vh;
        }
        
        .integration-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e0e0e0;
        }
        
        .integration-header h2 {
          margin: 0;
          color: #333;
          font-size: 28px;
        }
        
        .navigation-links {
          display: flex;
          gap: 15px;
        }
        
        .nav-link {
          text-decoration: none;
          color: #667eea;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        
        .nav-link:hover {
          background: #f0f0f0;
          transform: translateY(-1px);
        }
        
        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }
        
        .empty-state h3 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 24px;
        }
        
        .empty-state p {
          color: #666;
          font-size: 16px;
          line-height: 1.6;
          margin: 0 0 30px 0;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .empty-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
        }
        
        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        
        .btn-secondary {
          background: #f0f0f0;
          color: #666;
        }
        
        .btn-secondary:hover {
          background: #e0e0e0;
          transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
          .integration-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          
          .navigation-links {
            width: 100%;
            justify-content: space-between;
          }
          
          .empty-actions {
            flex-direction: column;
            align-items: center;
          }
          
          .btn {
            width: 100%;
            max-width: 200px;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default IntegrationLevel;