import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const IntegrationLevel = () => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const graphRef = useRef(null);

  // 处理鼠标按下事件
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  // 处理鼠标移动事件
  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({ 
        x: e.clientX - dragStart.x, 
        y: e.clientY - dragStart.y 
      });
    }
  };

  // 处理鼠标释放事件
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 处理鼠标滚轮事件（缩放）
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(3, scale * delta));
    setScale(newScale);
  };

  // 重置视图
  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // 放大
  const zoomIn = () => {
    setScale(Math.min(3, scale * 1.2));
  };

  // 缩小
  const zoomOut = () => {
    setScale(Math.max(0.1, scale * 0.8));
  };

  return (
    <div className="integration-level">
      <div className="integration-header">
        <div className="header-left">
          <h2>Integration Level</h2>
          <div className="navigation-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/input" className="nav-link">Input Level</Link>
          </div>
        </div>
        <div className="header-actions">
          <button onClick={resetView} className="btn btn-secondary">Reset View</button>
        </div>
      </div>
      
      <div className="integration-content">
        {/* Requisitions 部分 */}
        <div className="requisitions-section">
          <h3>Requisitions</h3>
          <div className="requisitions-container">
            <div className="requisition-box active">Requisition 1</div>
            <div className="requisition-box">Requisition 2</div>
            <div className="requisition-box">Requisition 3</div>
          </div>
        </div>
        
        {/* 主内容区域 */}
        <div className="main-content">
          {/* Graph 部分 */}
          <div className="graph-section">
            <div className="graph-header">
              <h3>Graph</h3>
              <div className="graph-controls">
                <button onClick={zoomIn} className="control-btn">+</button>
                <button onClick={zoomOut} className="control-btn">-</button>
                <span className="scale-info">Scale: {Math.round(scale * 100)}%</span>
              </div>
            </div>
            
            <div 
              className="graph-container"
              ref={graphRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
            >
              <div 
                className="graph-content"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transformOrigin: '0 0'
                }}
              >
                {/* 图形节点和连接线 */}
                <svg width="800" height="600" viewBox="0 0 800 600">
                  {/* 连接线 */}
                  <g stroke="#007bff" strokeWidth="2">
                    <line x1="100" y1="50" x2="200" y2="150" />
                    <line x1="180" y1="50" x2="250" y2="150" />
                    <line x1="260" y1="50" x2="300" y2="150" />
                    <line x1="200" y1="180" x2="200" y2="250" />
                    <line x1="250" y1="180" x2="200" y2="250" />
                    <line x1="300" y1="180" x2="250" y2="250" />
                    <line x1="200" y1="280" x2="150" y2="350" />
                    <line x1="250" y1="280" x2="300" y2="350" />
                    <line x1="200" y1="280" x2="250" y2="350" />
                    <line x1="250" y1="280" x2="350" y2="450" />
                    <line x1="300" y1="380" x2="350" y2="450" />
                    <line x1="350" y1="480" x2="400" y2="550" />
                    <line x1="300" y1="280" x2="600" y2="150" />
                    <line x1="350" y1="380" x2="600" y2="250" />
                    <line x1="400" y1="480" x2="600" y2="350" />
                  </g>
                  
                  {/* 节点 */}
                  <g>
                    <rect x="180" y="130" width="80" height="40" fill="#28a745" stroke="#000" strokeWidth="2" />
                    <text x="220" y="155" textAnchor="middle" fill="white" fontWeight="bold">Node 1</text>
                    
                    <rect x="230" y="130" width="80" height="40" fill="#28a745" stroke="#000" strokeWidth="2" />
                    <text x="270" y="155" textAnchor="middle" fill="white" fontWeight="bold">Node 2</text>
                    
                    <rect x="280" y="130" width="80" height="40" fill="#28a745" stroke="#000" strokeWidth="2" />
                    <text x="320" y="155" textAnchor="middle" fill="white" fontWeight="bold">Node 3</text>
                    
                    <rect x="180" y="230" width="80" height="40" fill="#28a745" stroke="#000" strokeWidth="2" />
                    <text x="220" y="255" textAnchor="middle" fill="white" fontWeight="bold">Node 4</text>
                    
                    <rect x="230" y="230" width="80" height="40" fill="#28a745" stroke="#000" strokeWidth="2" />
                    <text x="270" y="255" textAnchor="middle" fill="white" fontWeight="bold">Node 5</text>
                    
                    <rect x="130" y="330" width="80" height="40" fill="#28a745" stroke="#000" strokeWidth="2" />
                    <text x="170" y="355" textAnchor="middle" fill="white" fontWeight="bold">Node 6</text>
                    
                    <rect x="230" y="330" width="80" height="40" fill="#28a745" stroke="#000" strokeWidth="2" />
                    <text x="270" y="355" textAnchor="middle" fill="white" fontWeight="bold">Node 7</text>
                    
                    <rect x="280" y="330" width="80" height="40" fill="#28a745" stroke="#000" strokeWidth="2" />
                    <text x="320" y="355" textAnchor="middle" fill="white" fontWeight="bold">Node 8</text>
                    
                    <rect x="330" y="430" width="80" height="40" fill="#28a745" stroke="#000" strokeWidth="2" />
                    <text x="370" y="455" textAnchor="middle" fill="white" fontWeight="bold">Node 9</text>
                    
                    <rect x="380" y="530" width="80" height="40" fill="#28a745" stroke="#000" strokeWidth="2" />
                    <text x="420" y="555" textAnchor="middle" fill="white" fontWeight="bold">Node 10</text>
                  </g>
                </svg>
              </div>
            </div>
          </div>
          
          {/* External Links 部分 */}
          <div className="external-links-section">
            <h3>External Links</h3>
            <div className="external-links-container">
              <div className="external-link-box">
                <h4>Link 1</h4>
                <p>Description of external link 1</p>
              </div>
              <div className="external-link-box">
                <h4>Link 2</h4>
                <p>Description of external link 2</p>
              </div>
              <div className="external-link-box">
                <h4>Link 3</h4>
                <p>Description of external link 3</p>
              </div>
              <div className="external-link-box">
                <h4>Link 4</h4>
                <p>Description of external link 4</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .integration-level {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
          min-height: 80vh;
        }
        
        .integration-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e0e0e0;
        }
        
        .header-left {
          display: flex;
          flex-direction: column;
        }
        
        .integration-header h2 {
          margin: 0 0 10px 0;
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
          padding: 6px 12px;
          border-radius: 6px;
          transition: all 0.2s ease;
          font-size: 14px;
        }
        
        .nav-link:hover {
          background: #f0f0f0;
          transform: translateY(-1px);
        }
        
        .header-actions {
          display: flex;
          gap: 10px;
        }
        
        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
        }
        
        .btn-secondary {
          background: #f0f0f0;
          color: #666;
        }
        
        .btn-secondary:hover {
          background: #e0e0e0;
          transform: translateY(-1px);
        }
        
        .integration-content {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        
        /* Requisitions 部分 */
        .requisitions-section {
          margin-bottom: 20px;
        }
        
        .requisitions-section h3 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 20px;
          color: #dc3545;
        }
        
        .requisitions-container {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }
        
        .requisition-box {
          padding: 10px 20px;
          border: 2px solid #000;
          border-radius: 4px;
          background: white;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .requisition-box.active {
          background: #dc3545;
          color: white;
        }
        
        .requisition-box:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        /* 主内容区域 */
        .main-content {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 30px;
          height: 70vh;
        }
        
        /* Graph 部分 */
        .graph-section {
          display: flex;
          flex-direction: column;
          border: 2px solid #000;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .graph-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: #f8f9fa;
          border-bottom: 2px solid #000;
        }
        
        .graph-header h3 {
          margin: 0;
          color: #333;
          font-size: 18px;
          color: #dc3545;
        }
        
        .graph-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .control-btn {
          width: 30px;
          height: 30px;
          border: 1px solid #000;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .control-btn:hover {
          background: #f0f0f0;
          transform: scale(1.05);
        }
        
        .scale-info {
          font-size: 14px;
          color: #666;
          min-width: 100px;
        }
        
        .graph-container {
          flex: 1;
          overflow: hidden;
          position: relative;
          background: white;
          cursor: ${isDragging ? 'grabbing' : 'grab'};
        }
        
        .graph-content {
          position: absolute;
          top: 0;
          left: 0;
          transition: transform 0.1s ease-out;
        }
        
        /* External Links 部分 */
        .external-links-section {
          display: flex;
          flex-direction: column;
          border: 2px solid #000;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .external-links-section h3 {
          margin: 0;
          padding: 15px 20px;
          background: #f8f9fa;
          border-bottom: 2px solid #000;
          color: #333;
          font-size: 18px;
          color: #dc3545;
        }
        
        .external-links-container {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .external-link-box {
          padding: 15px;
          border: 2px solid #28a745;
          border-radius: 4px;
          background: white;
          transition: all 0.2s ease;
        }
        
        .external-link-box:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
        }
        
        .external-link-box h4 {
          margin: 0 0 5px 0;
          color: #333;
          font-size: 16px;
        }
        
        .external-link-box p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }
        
        @media (max-width: 1024px) {
          .main-content {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr auto;
            height: auto;
          }
          
          .external-links-section {
            max-height: 400px;
          }
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
          
          .header-actions {
            width: 100%;
            justify-content: flex-end;
          }
          
          .requisitions-container {
            justify-content: center;
          }
          
          .graph-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .graph-controls {
            width: 100%;
            justify-content: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

export default IntegrationLevel;