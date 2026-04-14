import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MDEditor from '@uiw/react-markdown-editor';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import '@uiw/react-markdown-editor/markdown-editor.css';

// 自定义Markdown组件，支持KaTeX
const MarkdownWithKaTeX = ({ source, style }) => {
  const [processedSource, setProcessedSource] = useState('');
  
  useEffect(() => {
    // 处理KaTeX公式
    let processedText = source;
    
    // 处理块级公式 $$...$$
    const blockFormulaRegex = /\$\$([\s\S]*?)\$\$/g;
    processedText = processedText.replace(blockFormulaRegex, (match, formula) => {
      try {
        const html = katex.renderToString(formula.trim(), {
          throwOnError: false,
          displayMode: true
        });
        return `<div class="katex-display">${html}</div>`;
      } catch (error) {
        console.error('Error rendering KaTeX block formula:', error);
        return match;
      }
    });
    
    // 处理行内公式 $...$
    const inlineFormulaRegex = /\$([^\$]+)\$/g;
    processedText = processedText.replace(inlineFormulaRegex, (match, formula) => {
      try {
        const html = katex.renderToString(formula.trim(), {
          throwOnError: false,
          displayMode: false
        });
        return `<span class="katex-inline">${html}</span>`;
      } catch (error) {
        console.error('Error rendering KaTeX inline formula:', error);
        return match;
      }
    });
    
    setProcessedSource(processedText);
  }, [source]);
  
  return (
    <div style={style}>
      <MDEditor.Markdown source={processedSource} />
    </div>
  );
};

const LearningProjects = () => {
  // 从localStorage获取用户信息
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedDirectory, setSelectedDirectory] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [showDirectoryForm, setShowDirectoryForm] = useState(false);
  const [showContentForm, setShowContentForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showEditContentForm, setShowEditContentForm] = useState(false);
  const [showEditDirectoryForm, setShowEditDirectoryForm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [editingContent, setEditingContent] = useState(null);
  const [editingDirectory, setEditingDirectory] = useState(null);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [newDirectory, setNewDirectory] = useState({ name: '', description: '', parentId: null });
  const [newContent, setNewContent] = useState({ title: '', content: '', images: [] });
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, target: null, type: null });
  const [longPressTimer, setLongPressTimer] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [projectsCollapsed, setProjectsCollapsed] = useState(false);
  const [collapsedDirectories, setCollapsedDirectories] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const [copyTarget, setCopyTarget] = useState(null);
  const [copyType, setCopyType] = useState(null);
  const [selectedCopyProject, setSelectedCopyProject] = useState(null);
  const [selectedCopyDestination, setSelectedCopyDestination] = useState(null);
  const [expandedDirectories, setExpandedDirectories] = useState(new Set());

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`/api/learning/projects/${user.id}`);
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleCreateProject = () => {
    // 重置表单
    setNewProject({ name: '', description: '' });
    // 显示创建项目表单
    setShowProjectForm(true);
  };

  const toggleProjectsCollapse = () => {
    setProjectsCollapsed(!projectsCollapsed);
  };

  const toggleDirectoryCollapse = (directoryId) => {
    const newCollapsed = new Set(collapsedDirectories);
    if (newCollapsed.has(directoryId)) {
      newCollapsed.delete(directoryId);
    } else {
      newCollapsed.add(directoryId);
    }
    setCollapsedDirectories(newCollapsed);
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    if (!newProject.name) return;

    try {
      const response = await axios.post('/api/learning/projects', {
        userId: user.id,
        name: newProject.name,
        overview: newProject.description
      });
      setProjects([...projects, response.data.project]);
      setShowProjectForm(false);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    }
  };

  const handleAddDirectory = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;

    try {
      const response = await axios.post(`/api/learning/project/${selectedProject.id}/directories`, newDirectory);
      // 使用后端返回的项目数据，确保数据一致性
      const updatedProject = response.data.project;
      setSelectedProject(updatedProject);
      setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
      
      // 如果当前有选中的目录，从更新后的项目中重新找到它
      if (selectedDirectory) {
        const findDirectory = (directories, directoryId) => {
          for (const dir of directories) {
            if (dir.id === directoryId) {
              return dir;
            }
            if (dir.subdirectories) {
              const found = findDirectory(dir.subdirectories, directoryId);
              if (found) return found;
            }
          }
          return null;
        };
        
        const updatedDirectory = findDirectory(updatedProject.structure.directories, selectedDirectory.id);
        if (updatedDirectory) {
          setSelectedDirectory(updatedDirectory);
        }
      }
      
      setNewDirectory({ name: '', description: '', parentId: null });
      setShowDirectoryForm(false);
    } catch (error) {
      console.error('Error adding directory:', error);
    }
  };

  const handleAddContent = async (e) => {
    e.preventDefault();
    if (!selectedProject || !selectedDirectory) return;

    try {
      const response = await axios.post(`/api/learning/project/${selectedProject.id}/directory/${selectedDirectory.id}/content`, newContent);
      // 使用后端返回的项目数据，确保数据一致性
      const updatedProject = response.data.project;
      
      if (updatedProject) {
        setSelectedProject(updatedProject);
        setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
        
        // 从更新后的项目中重新找到当前选中的目录
        const findDirectory = (directories, directoryId) => {
          for (const dir of directories) {
            if (dir.id === directoryId) {
              return dir;
            }
            if (dir.subdirectories) {
              const found = findDirectory(dir.subdirectories, directoryId);
              if (found) return found;
            }
          }
          return null;
        };
        
        const updatedDirectory = findDirectory(updatedProject.structure.directories, selectedDirectory.id);
        if (updatedDirectory) {
          setSelectedDirectory(updatedDirectory);
        }
      }
      
      // 重置表单状态
      setNewContent({ title: '', content: '', images: [] });
      setShowContentForm(false);
      setSelectedContent(null);
      
      // 滚动到内容列表
      setTimeout(() => {
        const contentList = document.querySelector('.content-list-section');
        if (contentList) {
          contentList.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } catch (error) {
      console.error('Error adding content:', error);
    }
  };

  const handleUpdateContent = async (e) => {
    e.preventDefault();
    if (!selectedProject || !selectedDirectory || !editingContent) return;

    try {
      const response = await axios.put(`/api/learning/project/${selectedProject.id}/directory/${selectedDirectory.id}/content/${editingContent.id}`, newContent);
      // 使用后端返回的项目数据，确保数据一致性
      const updatedProject = response.data.project;
      
      if (updatedProject) {
        setSelectedProject(updatedProject);
        setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
        
        // 从更新后的项目中重新找到当前选中的目录
        const findDirectory = (directories, directoryId) => {
          for (const dir of directories) {
            if (dir.id === directoryId) {
              return dir;
            }
            if (dir.subdirectories) {
              const found = findDirectory(dir.subdirectories, directoryId);
              if (found) return found;
            }
          }
          return null;
        };
        
        const updatedDirectory = findDirectory(updatedProject.structure.directories, selectedDirectory.id);
        if (updatedDirectory) {
          setSelectedDirectory(updatedDirectory);
        }
      }
      
      // 重置表单状态
      setNewContent({ title: '', content: '', images: [] });
      setShowEditContentForm(false);
      setEditingContent(null);
      setSelectedContent(null);
      
      // 滚动到内容列表
      setTimeout(() => {
        const contentList = document.querySelector('.content-list-section');
        if (contentList) {
          contentList.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  const handleUpdateDirectory = async (e) => {
    e.preventDefault();
    if (!selectedProject || !editingDirectory) return;

    try {
      const response = await axios.put(`/api/learning/project/${selectedProject.id}/directory/${editingDirectory.id}`, newDirectory);
      // 使用后端返回的项目数据，确保数据一致性
      const updatedProject = response.data.project;
      setSelectedProject(updatedProject);
      setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
      
      // 如果当前选中的目录是被编辑的目录，更新它
      if (selectedDirectory?.id === editingDirectory.id) {
        const findDirectory = (directories, directoryId) => {
          for (const dir of directories) {
            if (dir.id === directoryId) {
              return dir;
            }
            if (dir.subdirectories) {
              const found = findDirectory(dir.subdirectories, directoryId);
              if (found) return found;
            }
          }
          return null;
        };
        
        const updatedDirectory = findDirectory(updatedProject.structure.directories, editingDirectory.id);
        if (updatedDirectory) {
          setSelectedDirectory(updatedDirectory);
        }
      }
      
      setNewDirectory({ name: '', description: '', parentId: null });
      setShowEditDirectoryForm(false);
      setEditingDirectory(null);
    } catch (error) {
      console.error('Error updating directory:', error);
    }
  };

  // 处理图片上传到服务器
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // 获取上传后的图片URL
      const imageUrl = response.data.url;
      
      // 在Markdown内容中插入图片链接
      const imageMarkdown = `![${file.name}](${imageUrl})\n`;
      setNewContent(prev => ({
        ...prev,
        content: prev.content + imageMarkdown
      }));
      
      console.log('Image uploaded successfully:', imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploadingImage(false);
      // 清空input，允许重复上传同一文件
      e.target.value = '';
    }
  };

  // 处理右键菜单
  const handleContextMenu = (e, target, type) => {
    e.preventDefault();
    
    // 计算菜单位置，确保不超出页面范围
    const menuWidth = 150; // 菜单宽度
    const menuHeight = 160; // 菜单高度（4个菜单项，每个40px）
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    let x = e.clientX;
    let y = e.clientY;
    
    // 检查右侧边界
    if (x + menuWidth > windowWidth) {
      x = windowWidth - menuWidth - 10;
    }
    
    // 检查底部边界
    if (y + menuHeight > windowHeight) {
      y = windowHeight - menuHeight - 10;
    }
    
    // 确保x和y不小于0
    x = Math.max(10, x);
    y = Math.max(10, y);
    
    setContextMenu({
      show: true,
      x,
      y,
      target,
      type
    });
  };

  // 处理长按菜单（移动端和大屏）
  const handleLongPress = (e, target, type) => {
    e.preventDefault();
    
    // 计算菜单位置，确保不超出页面范围
    const menuWidth = 150; // 菜单宽度
    const menuHeight = 160; // 菜单高度（4个菜单项，每个40px）
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    let x = e.clientX;
    let y = e.clientY;
    
    // 检查右侧边界
    if (x + menuWidth > windowWidth) {
      x = windowWidth - menuWidth - 10;
    }
    
    // 检查底部边界
    if (y + menuHeight > windowHeight) {
      y = windowHeight - menuHeight - 10;
    }
    
    // 确保x和y不小于0
    x = Math.max(10, x);
    y = Math.max(10, y);
    
    setContextMenu({
      show: true,
      x,
      y,
      target,
      type
    });
  };

  // 处理鼠标按下
  const handleMouseDown = (e, target, type) => {
    const timer = setTimeout(() => handleLongPress(e, target, type), 500);
    setLongPressTimer(timer);
  };

  // 处理鼠标释放
  const handleMouseUp = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  // 关闭右键菜单
  const closeContextMenu = () => {
    setContextMenu({ show: false, x: 0, y: 0, target: null, type: null });
  };

  // 处理菜单项点击
  const handleMenuItemClick = (action) => {
    const { target, type } = contextMenu;
    console.log('=== handleMenuItemClick ===');
    console.log('Action:', action);
    console.log('Type:', type);
    console.log('Target:', target);
    console.log('Selected Project:', selectedProject);
    
    if (action === 'Delete') {
      // 显示确认对话框
      setConfirmAction({
        action: 'delete',
        type: type,
        target: target
      });
      setShowConfirmDialog(true);
    } else if (action === 'Edit') {
      if (type === 'content') {
        // 设置编辑内容
        setEditingContent(target);
        setNewContent({ title: target.title, content: target.content, images: target.images || [] });
        setShowEditContentForm(true);
        // 滚动到编辑界面
        setTimeout(() => {
          const editor = document.querySelector('.markdown-editor');
          if (editor) {
            editor.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      } else if (type === 'directory') {
        // 设置编辑目录
        setEditingDirectory(target);
        setNewDirectory({ name: target.name, description: target.description || '', parentId: target.parentId });
        setShowEditDirectoryForm(true);
        // 滚动到编辑界面
        setTimeout(() => {
          const dialog = document.querySelector('.dialog');
          if (dialog) {
            dialog.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      } else {
        console.log('Edit functionality not implemented yet for', type);
      }
    } else if (action === 'Export') {
      // TODO: 实现导出功能
      console.log('Export functionality not implemented yet');
    } else if (action === 'Copy') {
      // 处理复制功能
      setCopyTarget(target);
      setCopyType(type);
      // 设置默认复制项目为当前项目
      setSelectedCopyProject(selectedProject);
      // 设置默认复制目标为当前位置
      if (type === 'content' && selectedDirectory) {
        setSelectedCopyDestination(selectedDirectory);
      } else if (type === 'directory' && selectedProject) {
        // 对于目录，默认目标为根目录
        setSelectedCopyDestination({ id: null, name: 'Root', isRoot: true });
      }
      // 重置展开的目录
      setExpandedDirectories(new Set());
      setShowCopyDialog(true);
    }
    
    closeContextMenu();
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    
    const { action, type, target } = confirmAction;
    
    if (action === 'delete') {
      if (type === 'project') {
        try {
          console.log('Deleting project with ID:', target.id);
          const url = `/api/learning/project/${target.id}`;
          console.log('Request URL:', url);
          await axios.delete(url);
          setProjects(projects.filter(p => p.id !== target.id));
          if (selectedProject?.id === target.id) {
            setSelectedProject(null);
            setSelectedDirectory(null);
          }
        } catch (error) {
          console.error('Error deleting project:', error);
          alert('Failed to delete project');
        }
      } else if (type === 'directory') {
          if (!selectedProject) {
            alert('Please select a project first');
            setShowConfirmDialog(false);
            setConfirmAction(null);
            return;
          }
          try {
            console.log('Deleting directory with ID:', target.id);
            console.log('From project with ID:', selectedProject.id);
            const url = `/api/learning/project/${selectedProject.id}/directory/${target.id}`;
            console.log('Request URL:', url);
            await axios.delete(url);
            console.log('Delete response: success');
            
            // 删除成功后重新获取项目数据
            await fetchProjects();
            
            // 重新获取当前项目详情
            const projectResponse = await axios.get(`/api/learning/project/${selectedProject.id}`);
            setSelectedProject(projectResponse.data.project);
            
            if (selectedDirectory?.id === target.id) {
              setSelectedDirectory(null);
            }
          } catch (error) {
            console.error('Error deleting directory:', error);
            console.error('Error response:', error.response?.data);
            alert('Failed to delete directory');
          }
      } else if (type === 'content') {
          if (!selectedProject || !selectedDirectory) {
            alert('Please select a project and directory first');
            setShowConfirmDialog(false);
            setConfirmAction(null);
            return;
          }
          try {
            console.log('Deleting content with ID:', target.id);
            const url = `/api/learning/project/${selectedProject.id}/directory/${selectedDirectory.id}/content/${target.id}`;
            await axios.delete(url);
            
            // 删除成功后重新获取项目数据
            await fetchProjects();
            
            // 重新获取当前项目详情
            const projectResponse = await axios.get(`/api/learning/project/${selectedProject.id}`);
            setSelectedProject(projectResponse.data.project);
            
            // 重新找到当前选中的目录
            const findDirectory = (directories, directoryId) => {
              for (const dir of directories) {
                if (dir.id === directoryId) {
                  return dir;
                }
                if (dir.subdirectories) {
                  const found = findDirectory(dir.subdirectories, directoryId);
                  if (found) return found;
                }
              }
              return null;
            };
            
            const updatedProject = projectResponse.data.project;
            const updatedDirectory = findDirectory(updatedProject.structure.directories, selectedDirectory.id);
            if (updatedDirectory) {
              setSelectedDirectory(updatedDirectory);
            }
            
            if (selectedContent?.id === target.id) {
              setSelectedContent(null);
            }
          } catch (error) {
            console.error('Error deleting content:', error);
            alert('Failed to delete content');
          }
      }
    }
    
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  const handleCopyAction = async () => {
    if (!copyTarget || !copyType || !selectedCopyDestination || !selectedCopyProject) {
      return;
    }

    try {
      if (copyType === 'content') {
        // 复制内容
        const newContent = {
          title: copyTarget.title,
          content: copyTarget.content,
          images: copyTarget.images || []
        };

        const targetDirectoryId = selectedCopyDestination.isRoot ? 
          (selectedCopyProject.structure?.directories[0]?.id || null) : 
          selectedCopyDestination.id;

        if (!targetDirectoryId) {
          alert('Please select a valid destination directory');
          return;
        }

        const response = await axios.post(
          `/api/learning/project/${selectedCopyProject.id}/directory/${targetDirectoryId}/content`,
          newContent
        );

        console.log('Content copied successfully:', response.data);
        
        // 重新获取项目数据
        await fetchProjects();
        
        // 如果目标项目是当前选中的项目，更新它
        if (selectedProject?.id === selectedCopyProject.id) {
          const projectResponse = await axios.get(`/api/learning/project/${selectedCopyProject.id}`);
          setSelectedProject(projectResponse.data.project);

          // 如果当前选中的目录是目标目录，更新它
          if (selectedDirectory?.id === targetDirectoryId) {
            const findDirectory = (directories, directoryId) => {
              for (const dir of directories) {
                if (dir.id === directoryId) {
                  return dir;
                }
                if (dir.subdirectories) {
                  const found = findDirectory(dir.subdirectories, directoryId);
                  if (found) return found;
                }
              }
              return null;
            };
            const updatedDirectory = findDirectory(projectResponse.data.project.structure.directories, targetDirectoryId);
            if (updatedDirectory) {
              setSelectedDirectory(updatedDirectory);
            }
          }
        }

      } else if (copyType === 'directory') {
        // 复制目录（递归复制）
        const copyDirectory = async (dir, parentId) => {
          const newDirectory = {
            name: dir.name,
            description: dir.description,
            parentId: parentId
          };

          const response = await axios.post(
            `/api/learning/project/${selectedCopyProject.id}/directories`,
            newDirectory
          );

          const createdDirectory = response.data.directory;

          // 复制目录下的内容
          if (dir.content && dir.content.length > 0) {
            for (const content of dir.content) {
              const newContent = {
                title: content.title,
                content: content.content,
                images: content.images || []
              };
              await axios.post(
                `/api/learning/project/${selectedCopyProject.id}/directory/${createdDirectory.id}/content`,
                newContent
              );
            }
          }

          // 递归复制子目录
          if (dir.subdirectories && dir.subdirectories.length > 0) {
            for (const subdir of dir.subdirectories) {
              await copyDirectory(subdir, createdDirectory.id);
            }
          }

          return createdDirectory;
        };

        const parentId = selectedCopyDestination.isRoot ? null : selectedCopyDestination.id;
        await copyDirectory(copyTarget, parentId);

        console.log('Directory copied successfully');
        
        // 重新获取项目数据
        await fetchProjects();
        
        // 如果目标项目是当前选中的项目，更新它
        if (selectedProject?.id === selectedCopyProject.id) {
          const projectResponse = await axios.get(`/api/learning/project/${selectedCopyProject.id}`);
          setSelectedProject(projectResponse.data.project);
        }
      }

      // 关闭复制对话框
      setShowCopyDialog(false);
      setCopyTarget(null);
      setCopyType(null);
      setSelectedCopyProject(null);
      setSelectedCopyDestination(null);
      setExpandedDirectories(new Set());

      alert(`${copyType === 'content' ? 'Content' : 'Directory'} copied successfully`);

    } catch (error) {
      console.error(`Error copying ${copyType}:`, error);
      alert(`Failed to copy ${copyType}`);
    }
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setSelectedDirectory(null);
    setSelectedContent(null);
  };

  const handleSelectDirectory = (directory) => {
    setSelectedDirectory(directory);
    setSelectedContent(null);
  };

  // 递归渲染目录树
  const renderDirectoryTree = (directories, level = 0) => {
    return directories.map(dir => {
      const isCollapsed = collapsedDirectories.has(dir.id);
      const hasSubdirectories = dir.subdirectories && dir.subdirectories.length > 0;
      
      return (
        <div key={dir.id}>
          <div
            className={`directory-item ${selectedDirectory?.id === dir.id ? 'active' : ''}`}
            style={{ paddingLeft: `${level * 20 + 10}px` }}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectDirectory(dir);
            }}
            onContextMenu={(e) => handleContextMenu(e, dir, 'directory')}
            onMouseDown={(e) => handleMouseDown(e, dir, 'directory')}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={(e) => {
              const timer = setTimeout(() => handleLongPress(e, dir, 'directory'), 500);
              setLongPressTimer(timer);
            }}
            onTouchEnd={() => {
              if (longPressTimer) {
                clearTimeout(longPressTimer);
                setLongPressTimer(null);
              }
            }}
          >
            {hasSubdirectories && (
              <span 
                className={`collapse-icon ${isCollapsed ? 'collapsed' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDirectoryCollapse(dir.id);
                }}
              >
                {isCollapsed ? '▶' : '▼'}
              </span>
            )}
            {!hasSubdirectories && <span className="collapse-icon-placeholder"></span>}
            <span className="folder-icon">📁</span>
            <span className="folder-name">{dir.name}</span>
          </div>
          {!isCollapsed && dir.subdirectories && renderDirectoryTree(dir.subdirectories, level + 1)}
        </div>
      );
    });
  };

  return (
    <div className="learning-projects">
      <div className="learning-header">
        <div className="header-left">
          <h2>Input Level</h2>
          <div className="navigation-links">
            <a href="/" className="nav-link">Home</a>
            <a href="/integration" className="nav-link">Integration Level</a>
            <a href="/practice" className="nav-link">Practice Level</a>
          </div>
        </div>
        <button onClick={handleCreateProject} className="create-btn">Create New Input</button>
      </div>

      <div className="learning-content">
        {/* 移动端侧边栏切换按钮 */}
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          📁 {sidebarOpen ? 'Close' : 'Open'} Sidebar
        </button>
        
        {/* 左侧项目列表 */}
        <div className={`projects-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3 onClick={toggleProjectsCollapse} className="collapsible-header">
              <span className={`collapse-icon ${projectsCollapsed ? 'collapsed' : ''}`}>
                {projectsCollapsed ? '▶' : '▼'}
              </span>
              My Projects
            </h3>
          </div>
          {!projectsCollapsed && (
            <>
              {projects.length === 0 ? (
                <p className="no-projects">No projects yet. Create your first project to get started!</p>
              ) : (
                <div className="projects-list">
              {projects.map(project => (
                <div
                  key={project.id}
                  className={`project-item ${selectedProject?.id === project.id ? 'active' : ''}`}
                  onClick={() => handleSelectProject(project)}
                  onContextMenu={(e) => handleContextMenu(e, project, 'project')}
                  onMouseDown={(e) => handleMouseDown(e, project, 'project')}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={(e) => {
                    const timer = setTimeout(() => handleLongPress(e, project, 'project'), 500);
                    setLongPressTimer(timer);
                  }}
                  onTouchEnd={() => {
                    if (longPressTimer) {
                      clearTimeout(longPressTimer);
                      setLongPressTimer(null);
                    }
                  }}
                >
                  <span className="project-icon">📚</span>
                  <span className="project-name">{project.name}</span>
                </div>
              ))}
            </div>
          )}
            </>
          )}

          {/* 目录表单 */}
          {selectedProject && (
            <div className="directory-form-section">
              <button 
                onClick={() => setShowDirectoryForm(!showDirectoryForm)} 
                className="toggle-form-btn"
              >
                {showDirectoryForm ? 'Cancel' : 'Add Directory'}
              </button>
              
              {showDirectoryForm && (
                <form onSubmit={handleAddDirectory} className="directory-form">
                  <input
                    type="text"
                    placeholder="Directory name"
                    value={newDirectory.name}
                    onChange={(e) => setNewDirectory({ ...newDirectory, name: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={newDirectory.description}
                    onChange={(e) => setNewDirectory({ ...newDirectory, description: e.target.value })}
                  />
                  <select
                    value={newDirectory.parentId || ''}
                    onChange={(e) => setNewDirectory({ ...newDirectory, parentId: e.target.value || null })}
                  >
                    <option value="">Root level</option>
                    {selectedProject.structure?.directories?.map(dir => (
                      <option key={dir.id} value={dir.id}>{dir.name}</option>
                    ))}
                  </select>
                  <button type="submit" className="btn btn-primary">Add</button>
                </form>
              )}
            </div>
          )}

          {/* 目录树 */}
          {selectedProject && selectedProject.structure?.directories && (
            <div className="directories-section">
              <h4>Directories</h4>
              {renderDirectoryTree(selectedProject.structure.directories)}
            </div>
          )}
        </div>

        {/* 右侧内容区域 */}
        <div className="content-area">
          {!selectedProject ? (
            <div className="no-selection">
              <p>Select a project to view its contents</p>
            </div>
          ) : !selectedDirectory ? (
            <div className="project-overview">
              <h3>{selectedProject.name}</h3>
              <p>{selectedProject.description || selectedProject.overview || 'No description'}</p>
              <p className="project-stats">
                Created: {new Date(selectedProject.createdAt).toLocaleDateString()}
              </p>
              <h4>Root Directories</h4>
              {selectedProject.structure?.directories && selectedProject.structure.directories.length > 0 ? (
                <div className="root-directories-list">
                  {selectedProject.structure.directories.map(directory => (
                    <div 
                      key={directory.id}
                      className="root-directory-item"
                      onClick={() => handleSelectDirectory(directory)}
                      onContextMenu={(e) => handleContextMenu(e, directory, 'directory')}
                      onTouchStart={(e) => {
                        const timer = setTimeout(() => handleLongPress(e, directory, 'directory'), 500);
                        return () => clearTimeout(timer);
                      }}
                    >
                      <span className="folder-icon">📁</span>
                      <span className="folder-name">{directory.name}</span>
                      {directory.description && <span className="folder-description">- {directory.description}</span>}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No directories yet. Add a directory to get started.</p>
              )}
            </div>
          ) : (
            <div className="content-section">
              <div className="content-header">
                <h3>{selectedDirectory.name}</h3>
                <button 
                  onClick={() => {
                    setShowContentForm(true);
                    // 滚动到编辑界面
                    setTimeout(() => {
                      const editor = document.querySelector('.markdown-editor');
                      if (editor) {
                        editor.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }, 100);
                  }} 
                  className="add-btn"
                >
                  Add Content
                </button>
              </div>

              {/* Markdown编辑器/查看器 */}
              <div className="markdown-editor-section">
                {showContentForm ? (
                  <div className="markdown-editor">
                    <h4>Add New Content</h4>
                    <form onSubmit={handleAddContent}>
                      <div className="form-group">
                        <label>Title *</label>
                        <input 
                          type="text" 
                          value={newContent.title} 
                          onChange={(e) => setNewContent({ ...newContent, title: e.target.value })} 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label>Content *</label>
                        <MDEditor
                          value={newContent.content}
                          onChange={(value) => setNewContent({ ...newContent, content: value || '' })}
                          height={400}
                          preview="edit"
                        />
                      </div>
                      
                      {/* 图片上传区域 */}
                      <div className="form-group">
                        <label>Insert Image</label>
                        <div className="image-upload-section">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                            id="image-upload"
                            style={{ display: 'none' }}
                          />
                          <label htmlFor="image-upload" className={`upload-btn ${uploadingImage ? 'disabled' : ''}`}>
                            {uploadingImage ? 'Uploading...' : '📷 Upload Image'}
                          </label>
                          <span className="upload-hint">Click to upload image (max 10MB)</span>
                        </div>
                      </div>
                      
                      <div className="form-actions">
                        <button type="submit" className="btn btn-primary">Save Content</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowContentForm(false)}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                ) : showEditContentForm ? (
                  <div className="markdown-editor">
                    <h4>Edit Content</h4>
                    <form onSubmit={handleUpdateContent}>
                      <div className="form-group">
                        <label>Title *</label>
                        <input 
                          type="text" 
                          value={newContent.title} 
                          onChange={(e) => setNewContent({ ...newContent, title: e.target.value })} 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label>Content *</label>
                        <MDEditor
                          value={newContent.content}
                          onChange={(value) => setNewContent({ ...newContent, content: value || '' })}
                          height={400}
                          preview="edit"
                        />
                      </div>
                      
                      {/* 图片上传区域 */}
                      <div className="form-group">
                        <label>Insert Image</label>
                        <div className="image-upload-section">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                            id="image-upload-edit"
                            style={{ display: 'none' }}
                          />
                          <label htmlFor="image-upload-edit" className={`upload-btn ${uploadingImage ? 'disabled' : ''}`}>
                            {uploadingImage ? 'Uploading...' : '📷 Upload Image'}
                          </label>
                          <span className="upload-hint">Click to upload image (max 10MB)</span>
                        </div>
                      </div>
                      
                      <div className="form-actions">
                        <button type="submit" className="btn btn-primary">Update Content</button>
                        <button type="button" className="btn btn-secondary" onClick={() => {
                          setShowEditContentForm(false);
                          setEditingContent(null);
                          setNewContent({ title: '', content: '', images: [] });
                        }}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                ) : showEditDirectoryForm ? (
                  <div className="dialog-overlay">
                    <div className="dialog" style={{ width: '500px' }}>
                      <div className="dialog-header">
                        <h3>Edit Directory</h3>
                        <button 
                          className="close-btn"
                          onClick={() => {
                            setShowEditDirectoryForm(false);
                            setEditingDirectory(null);
                            setNewDirectory({ name: '', description: '', parentId: null });
                          }}
                        >
                          ×
                        </button>
                      </div>
                      <div className="dialog-content">
                        <form onSubmit={handleUpdateDirectory}>
                          <div className="form-group">
                            <label>Directory Name *</label>
                            <input 
                              type="text" 
                              value={newDirectory.name} 
                              onChange={(e) => setNewDirectory({ ...newDirectory, name: e.target.value })} 
                              required 
                            />
                          </div>
                          <div className="form-group">
                            <label>Description (optional)</label>
                            <textarea 
                              value={newDirectory.description}
                              onChange={(e) => setNewDirectory({ ...newDirectory, description: e.target.value })}
                              rows={3}
                            />
                          </div>
                          <div className="form-actions">
                            <button type="submit" className="btn btn-primary">Update Directory</button>
                            <button type="button" className="btn btn-secondary" onClick={() => {
                              setShowEditDirectoryForm(false);
                              setEditingDirectory(null);
                              setNewDirectory({ name: '', description: '', parentId: null });
                            }}>
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                ) : null}
                
                {/* 浮动的添加内容按钮 */}
                {selectedDirectory && !showContentForm && !showEditContentForm && (
                  <button 
                    onClick={() => {
                      setShowContentForm(true);
                      // 滚动到编辑界面
                      setTimeout(() => {
                        const editor = document.querySelector('.markdown-editor');
                        if (editor) {
                          editor.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }, 100);
                    }} 
                    className="floating-add-btn"
                  >
                    +
                  </button>
                )}
              </div>

              {/* 内容列表 */}
              <div className="content-list-section">
                <h4>Contents</h4>
                {selectedDirectory.content && selectedDirectory.content.length > 0 ? (
                  <div className="content-list">
                    {selectedDirectory.content.map(content => (
                      <div 
                        key={content.id} 
                        className="content-item"
                        onContextMenu={(e) => handleContextMenu(e, content, 'content')}
                        onMouseDown={(e) => handleMouseDown(e, content, 'content')}
                        onMouseUp={handleMouseUp}
                        onTouchStart={(e) => {
                          const timer = setTimeout(() => handleLongPress(e, content, 'content'), 500);
                          return () => clearTimeout(timer);
                        }}
                      >
                        <div className="content-item-header">
                          <span className="content-icon">📄</span>
                          <span className="content-title">{content.title}</span>
                        </div>
                        <div className="content-item-body">
                          <MarkdownWithKaTeX 
                            source={content.content} 
                            style={{ whiteSpace: 'pre-wrap' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-content">
                    <p>No content yet. Click "Add Content" to start creating.</p>
                  </div>
                )}
              </div>

              {/* 子目录显示 */}
              {selectedDirectory.subdirectories && selectedDirectory.subdirectories.length > 0 && (
                <div className="subdirectories-section">
                  <h4>Subdirectories</h4>
                  <div className="subdirectories-list">
                    {selectedDirectory.subdirectories.map(subdir => (
                      <div 
                        key={subdir.id}
                        className="subdirectory-item"
                        onClick={() => handleSelectDirectory(subdir)}
                        onContextMenu={(e) => handleContextMenu(e, subdir, 'directory')}
                        onTouchStart={(e) => {
                          const timer = setTimeout(() => handleLongPress(e, subdir, 'directory'), 500);
                          return () => clearTimeout(timer);
                        }}
                      >
                        <span className="folder-icon">📁</span>
                        <span className="folder-name">{subdir.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 右键菜单 */}
      {contextMenu.show && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="context-menu-item" onClick={() => handleMenuItemClick('Edit')}>Edit</div>
          <div className="context-menu-item" onClick={() => handleMenuItemClick('Copy')}>Copy</div>
          <div className="context-menu-item" onClick={() => handleMenuItemClick('Export')}>Export</div>
          <div className="context-menu-item delete" onClick={() => handleMenuItemClick('Delete')}>Delete</div>
        </div>
      )}

      {/* 点击其他地方关闭菜单 */}
      {contextMenu.show && (
        <div className="context-menu-overlay" onClick={closeContextMenu} />
      )}

      <style>{`
        .learning-projects {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .learning-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e0e0e0;
        }

        .learning-header h2 {
          margin: 0;
          color: #333;
          font-size: 28px;
          margin-bottom: 10px;
        }

        .header-left {
          display: flex;
          flex-direction: column;
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

        .create-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .create-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .learning-content {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 30px;
        }

        .projects-sidebar {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          height: fit-content;
        }

        .projects-sidebar h3 {
          margin: 0 0 20px 0;
          color: #333;
          font-size: 20px;
        }

        .no-projects {
          color: #999;
          font-style: italic;
          text-align: center;
          padding: 20px;
        }

        .projects-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .project-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }

        .project-item:hover {
          background: #f5f5f5;
        }

        .project-item.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .project-icon {
          font-size: 20px;
        }

        .project-name {
          font-weight: 500;
        }

        .directory-form-section {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }

        .toggle-form-btn {
          width: 100%;
          background: #f0f0f0;
          border: none;
          padding: 10px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .toggle-form-btn:hover {
          background: #e0e0e0;
        }

        .directory-form {
          margin-top: 15px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .directory-form input,
        .directory-form select {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .directories-section {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }

        .directories-section h4 {
          margin: 0 0 15px 0;
          color: #666;
          font-size: 16px;
        }

        .directory-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
          width: auto;
          min-width: 200px;
        }

        .directory-item:hover {
          background: #f5f5f5;
        }

        .directory-item.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .folder-icon {
          font-size: 16px;
        }

        .folder-name {
          font-size: 14px;
          font-weight: 500;
        }

        .content-area {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          min-height: 500px;
        }

        .no-selection {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 300px;
          color: #999;
          font-size: 16px;
        }

        .project-overview h3 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 24px;
        }

        .project-overview p {
          color: #666;
          line-height: 1.6;
          margin: 10px 0;
        }

        .project-stats {
          color: #999;
          font-size: 14px;
        }

        .content-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 15px;
          border-bottom: 2px solid #e0e0e0;
        }

        .content-header h3 {
          margin: 0;
          color: #333;
          font-size: 22px;
        }

        .add-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .content-list-section {
          margin-bottom: 20px;
        }

        .content-list-section h4 {
          margin: 0 0 15px 0;
          color: #666;
          font-size: 16px;
        }

        .content-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .content-item {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 12px;
          border-radius: 8px;
          transition: all 0.2s ease;
          background: #f9f9f9;
          border: 1px solid #e0e0e0;
        }

        .content-item:hover {
          background: #f0f0f0;
          border-color: #ccc;
        }

        .content-item.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: transparent;
        }

        .content-icon {
          font-size: 18px;
        }

        .content-title {
          font-weight: 500;
          flex: 1;
        }

        .content-item-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e0e0e0;
        }

        .content-item-body {
          margin-top: 10px;
          padding: 15px;
          background: #f9f9f9;
          border-radius: 6px;
          border: 1px solid #e0e0e0;
          width: 100%;
          box-sizing: border-box;
        }

        .root-directories-list {
          margin-top: 15px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .root-directory-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #f9f9f9;
          border: 1px solid #e0e0e0;
        }

        .root-directory-item:hover {
          background: #f0f0f0;
          border-color: #ccc;
        }

        .folder-description {
          color: #666;
          font-size: 14px;
          margin-left: 5px;
        }

        .no-content {
          padding: 30px;
          text-align: center;
          color: #999;
          background: #f9f9f9;
          border-radius: 8px;
          border: 2px dashed #e0e0e0;
        }

        .markdown-editor-section {
          margin-bottom: 20px;
        }

        .markdown-editor {
          background: #f9f9f9;
          border-radius: 8px;
          padding: 20px;
          border: 1px solid #e0e0e0;
        }

        .markdown-editor h4 {
          margin: 0 0 20px 0;
          color: #333;
          font-size: 18px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #555;
          font-weight: 500;
          font-size: 14px;
        }

        .form-group input[type="text"] {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .form-group input[type="text"]:focus {
          outline: none;
          border-color: #667eea;
        }

        /* 图片上传区域样式 */
        .image-upload-section {
          display: flex;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .upload-btn {
          display: inline-block;
          padding: 10px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
          user-select: none;
        }

        .upload-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .upload-btn.disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .upload-hint {
          color: #999;
          font-size: 12px;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
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
        }

        .btn-sm {
          padding: 6px 12px;
          font-size: 12px;
        }

        .markdown-viewer {
          max-width: 100%;
        }

        .markdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e0e0e0;
        }

        .markdown-header h4 {
          margin: 0;
          color: #333;
          font-size: 20px;
        }

        .subdirectories-section {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }

        .subdirectories-section h4 {
          margin: 0 0 15px 0;
          color: #666;
          font-size: 16px;
        }

        .subdirectories-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 10px;
        }

        .subdirectory-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #f9f9f9;
          border: 1px solid #e0e0e0;
          user-select: none;
        }

        .subdirectory-item:hover {
          background: #f0f0f0;
          border-color: #ccc;
        }

        .context-menu {
          position: fixed;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          padding: 8px 0;
          z-index: 1000;
          min-width: 150px;
        }

        .context-menu-item {
          padding: 10px 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
        }

        .context-menu-item:hover {
          background: #f5f5f5;
        }

        .context-menu-item.delete {
          color: #e74c3c;
        }

        .context-menu-item.delete:hover {
          background: #fee;
        }

        .context-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 999;
        }

        /* 对话框样式 */
        .dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .dialog {
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow: hidden;
          animation: dialogFadeIn 0.3s ease;
        }

        @keyframes dialogFadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .dialog-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e0e0e0;
          background: #f9f9f9;
        }

        .dialog-header h3 {
          margin: 0;
          color: #333;
          font-size: 20px;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #999;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: #e0e0e0;
          color: #333;
        }

        .dialog-content {
          padding: 20px;
        }

        .dialog-content p {
          margin: 0 0 20px 0;
          color: #666;
          line-height: 1.6;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: #e0e0e0;
          color: #333;
          margin-left: 10px;
        }

        .btn-secondary:hover {
          background: #d0d0d0;
        }

        .btn-danger {
          background: #e74c3c;
          color: white;
        }

        .btn-danger:hover {
          background: #c0392b;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          color: #333;
          font-weight: 500;
          font-size: 14px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          font-size: 14px;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }

        /* 自定义Markdown编辑器样式 */
        .custom-markdown-editor {
          position: relative;
        }

        .custom-markdown-editor textarea {
          transition: all 0.2s ease;
        }

        .custom-markdown-editor textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .editor-hint {
          margin-top: 8px;
          color: #999;
          font-size: 12px;
          text-align: right;
        }

        /* 移动端侧边栏切换按钮 */
        .sidebar-toggle {
          display: none;
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1001;
          background: white;
          border: none;
          padding: 10px 15px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .sidebar-toggle:hover {
          background: #f5f5f5;
          transform: translateY(-2px);
        }

        /* 浮动的添加内容按钮 */
        .floating-add-btn {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          font-size: 24px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          transition: all 0.3s ease;
          z-index: 999;
        }

        .floating-add-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }

        .floating-add-btn:active {
          transform: scale(0.95);
        }

        @media (max-width: 768px) {
          .learning-content {
            grid-template-columns: 1fr;
          }

          .sidebar-toggle {
            display: block;
          }

          .projects-sidebar {
            position: fixed;
            top: 0;
            left: -320px;
            width: 300px;
            height: 100vh;
            z-index: 1000;
            transition: left 0.3s ease;
            overflow-y: auto;
          }

          .projects-sidebar.open {
            left: 0;
          }

          .content-area {
            padding-left: 20px;
            padding-right: 20px;
          }

          .content-header {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }

          .form-actions {
            flex-direction: column;
          }

          .subdirectories-list {
            grid-template-columns: 1fr;
          }

          .image-upload-section {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        /* 复制对话框样式 */
        .directory-selector {
          margin: 20px 0;
        }

        .directory-selector h4 {
          margin: 0 0 10px 0;
          color: #666;
          font-size: 16px;
        }

        .directory-tree {
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          max-height: 300px;
          overflow-y: auto;
          padding: 10px;
          background: #f9f9f9;
        }

        .directory-tree-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }

        .directory-tree-item:hover {
          background: #f0f0f0;
        }

        .directory-tree-item.selected {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .directory-tree-node {
          margin: 4px 0;
        }
      `}</style>

      {/* 创建项目对话框 */}
      {showProjectForm && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header">
              <h3>Create New Project</h3>
              <button 
                className="close-btn"
                onClick={() => setShowProjectForm(false)}
              >
                ×
              </button>
            </div>
            <div className="dialog-content">
              <form onSubmit={handleSubmitProject}>
                <div className="form-group">
                  <label htmlFor="projectName">Project Name *</label>
                  <input 
                    type="text" 
                    id="projectName"
                    value={newProject.name} 
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} 
                    required 
                    placeholder="Enter project name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="projectDescription">Description (optional)</label>
                  <textarea 
                    id="projectDescription"
                    value={newProject.description} 
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} 
                    placeholder="Enter project description"
                    rows={3}
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Create Project</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowProjectForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 确认对话框 */}
      {showConfirmDialog && confirmAction && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header">
              <h3>Confirmation</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowConfirmDialog(false);
                  setConfirmAction(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="dialog-content">
              <p>
                Are you sure you want to delete 
                {confirmAction.type === 'project' && ` project "${confirmAction.target.name}"`}
                {confirmAction.type === 'directory' && ` directory "${confirmAction.target.name}"`}
                {confirmAction.type === 'content' && ` content "${confirmAction.target.title}"`}
                ?
              </p>
              <div className="form-actions">
                <button type="button" className="btn btn-danger" onClick={handleConfirmAction}>
                  Delete
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setShowConfirmDialog(false);
                    setConfirmAction(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 复制确认对话框 */}
      {showCopyDialog && copyTarget && projects.length > 0 && (
        <div className="dialog-overlay">
          <div className="dialog" style={{ width: '500px' }}>
            <div className="dialog-header">
              <h3>Copy {copyType === 'content' ? 'Content' : 'Directory'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowCopyDialog(false);
                  setCopyTarget(null);
                  setCopyType(null);
                  setSelectedCopyProject(null);
                  setSelectedCopyDestination(null);
                  setExpandedDirectories(new Set());
                }}
              >
                ×
              </button>
            </div>
            <div className="dialog-content">
              <p>Select destination for copying {copyType === 'content' ? `"${copyTarget.title}"` : `"${copyTarget.name}"`}</p>
              
              {/* 项目选择器 */}
              <div className="project-selector" style={{ marginBottom: '20px' }}>
                <h4>Project</h4>
                <select 
                  value={selectedCopyProject?.id || ''}
                  onChange={(e) => {
                    const projectId = e.target.value;
                    const project = projects.find(p => p.id === projectId);
                    setSelectedCopyProject(project);
                    setSelectedCopyDestination(project ? { id: null, name: 'Root', isRoot: true } : null);
                    setExpandedDirectories(new Set());
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* 目录结构选择器 */}
              {selectedCopyProject && (
                <div className="directory-selector">
                  <h4>Destination</h4>
                  <div className="directory-tree">
                    {/* 根目录 */}
                    <div 
                      className={`directory-tree-item ${selectedCopyDestination?.isRoot ? 'selected' : ''}`}
                      onClick={() => setSelectedCopyDestination({ id: null, name: 'Root', isRoot: true })}
                    >
                      <span className="folder-icon">📁</span>
                      <span className="folder-name">Root</span>
                    </div>
                    
                    {/* 递归渲染目录结构 */}
                    {selectedCopyProject.structure?.directories && selectedCopyProject.structure.directories.map(directory => {
                      const renderDirectory = (dir, level = 1) => {
                        const isExpanded = expandedDirectories.has(dir.id);
                        
                        return (
                          <div key={dir.id} className="directory-tree-node">
                            <div 
                              className={`directory-tree-item ${selectedCopyDestination?.id === dir.id ? 'selected' : ''}`}
                              style={{ paddingLeft: `${level * 20}px` }}
                            >
                              {dir.subdirectories && dir.subdirectories.length > 0 && (
                                <span 
                                  className="expand-icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newExpanded = new Set(expandedDirectories);
                                    if (isExpanded) {
                                      newExpanded.delete(dir.id);
                                    } else {
                                      newExpanded.add(dir.id);
                                    }
                                    setExpandedDirectories(newExpanded);
                                  }}
                                  style={{
                                    marginRight: '5px',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                  }}
                                >
                                  {isExpanded ? '▼' : '▶'}
                                </span>
                              )}
                              <span 
                                className="folder-icon"
                                onClick={() => setSelectedCopyDestination(dir)}
                              >
                                📁
                              </span>
                              <span 
                                className="folder-name"
                                onClick={() => setSelectedCopyDestination(dir)}
                              >
                                {dir.name}
                              </span>
                            </div>
                            {isExpanded && dir.subdirectories && dir.subdirectories.map(subdir => renderDirectory(subdir, level + 1))}
                          </div>
                        );
                      };
                      return renderDirectory(directory);
                    })}
                  </div>
                </div>
              )}
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleCopyAction}
                  disabled={!selectedCopyProject || !selectedCopyDestination}
                >
                  Copy
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setShowCopyDialog(false);
                    setCopyTarget(null);
                    setCopyType(null);
                    setSelectedCopyProject(null);
                    setSelectedCopyDestination(null);
                    setExpandedDirectories(new Set());
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LearningProjects;
