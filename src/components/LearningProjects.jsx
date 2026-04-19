import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './learningProjects/styles.css';
import Sidebar from './learningProjects/Sidebar';
import ContentArea from './learningProjects/ContentEditor';
import { CreateProjectDialog, EditDirectoryDialog, ConfirmDialog, CopyDialog } from './learningProjects/Dialogs';
import { 
  fetchProjects, createProject, addDirectory, addContent, updateContent, 
  updateDirectory, deleteProject, deleteDirectory, deleteContent, 
  copyContent, copyDirectory, uploadImage, exportToJson, handleContextMenu, handleLongPress, findDirectory
} from './learningProjects/utils';

const LearningProjects = () => {
  // 从localStorage获取用户信息
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedDirectory, setSelectedDirectory] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const { projectId, directoryId, contentId } = useParams();
  const navigate = useNavigate();
  const [showDirectoryForm, setShowDirectoryForm] = useState(false);
  const [showContentForm, setShowContentForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showEditContentForm, setShowEditContentForm] = useState(false);
  const [showEditDirectoryForm, setShowEditDirectoryForm] = useState(false);
  const [showCopyDialog, setShowCopyDialog] = useState(false);
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
  const [copyTarget, setCopyTarget] = useState(null);
  const [copyType, setCopyType] = useState(null);
  const [selectedCopyProject, setSelectedCopyProject] = useState(null);
  const [selectedCopyDestination, setSelectedCopyDestination] = useState(null);
  const [expandedDirectories, setExpandedDirectories] = useState(new Set());

  // 只在用户变化时获取项目列表
  useEffect(() => {
    if (user) {
      fetchProjects(user.id, setProjects);
    }
  }, [user]);

  // 递归查找目录
  const findDirectory = (directories, directoryId) => {
    for (const directory of directories) {
      if (directory.id === directoryId) {
        return directory;
      }
      if (directory.subdirectories) {
        const found = findDirectory(directory.subdirectories, directoryId);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  // 当URL参数变化时，根据参数选择项目、目录和内容
  useEffect(() => {
    if (projectId && projects.length > 0) {
      // 找到对应的项目
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setSelectedProject(project);
        
        // 如果有directoryId，直接找到对应的目录
        if (directoryId) {
          const directory = findDirectory(project.directories || project.structure?.directories || [], directoryId);
          if (directory) {
            setSelectedDirectory(directory);
            
            // 如果有contentId，找到对应的内容
            if (contentId && directory.content) {
              const content = directory.content.find(c => c.id === contentId);
              if (content) {
                setSelectedContent(content);
                // 滚动到对应的内容
                setTimeout(() => {
                  const contentItem = document.querySelector(`[data-content-id="${contentId}"]`);
                  if (contentItem) {
                    contentItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }, 100);
              }
            }
          }
        }
      }
    }
  }, [projectId, directoryId, contentId, projects.length]);

  // 处理创建项目
  const handleCreateProject = () => {
    // 重置表单
    setNewProject({ name: '', description: '' });
    // 显示创建项目表单
    setShowProjectForm(true);
  };

  // 提交项目创建
  const handleSubmitProject = (e) => {
    e.preventDefault();
    if (!newProject.name || !user) return;
    createProject(user.id, newProject, setProjects, setShowProjectForm);
  };

  // 切换项目折叠状态
  const toggleProjectsCollapse = () => {
    setProjectsCollapsed(!projectsCollapsed);
  };

  // 切换目录折叠状态
  const toggleDirectoryCollapse = (directoryId) => {
    const newCollapsed = new Set(collapsedDirectories);
    if (newCollapsed.has(directoryId)) {
      newCollapsed.delete(directoryId);
    } else {
      newCollapsed.add(directoryId);
    }
    setCollapsedDirectories(newCollapsed);
  };

  // 提交目录添加
  const handleAddDirectory = (e) => {
    e.preventDefault();
    if (!selectedProject) return;
    addDirectory(selectedProject, newDirectory, setSelectedProject, setProjects, setNewDirectory, setShowDirectoryForm);
  };

  // 处理添加内容
  const handleAddContent = () => {
    setShowContentForm(true);
    // 滚动到编辑界面
    setTimeout(() => {
      const editor = document.querySelector('.markdown-editor');
      if (editor) {
        editor.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // 提交内容添加
  const handleSubmitContent = (e) => {
    e.preventDefault();
    if (!selectedProject || !selectedDirectory) return;
    addContent(selectedProject, selectedDirectory, newContent, setSelectedProject, setProjects, setNewContent, setShowContentForm, setSelectedContent);
  };

  // 取消内容添加
  const handleCancelContent = () => {
    setShowContentForm(false);
    setNewContent({ title: '', content: '', images: [] });
  };

  // 提交内容编辑
  const handleUpdateContent = (e) => {
    e.preventDefault();
    if (!selectedProject || !selectedDirectory || !editingContent) return;
    updateContent(selectedProject, selectedDirectory, editingContent, newContent, setSelectedProject, setProjects, setNewContent, setShowEditContentForm, setEditingContent, setSelectedContent, setSelectedDirectory);
  };

  // 取消内容编辑
  const handleCancelEditContent = () => {
    setShowEditContentForm(false);
    setEditingContent(null);
    setNewContent({ title: '', content: '', images: [] });
  };

  // 提交目录编辑
  const handleUpdateDirectory = (e) => {
    e.preventDefault();
    if (!selectedProject || !editingDirectory) return;
    updateDirectory(selectedProject, editingDirectory, newDirectory, setSelectedProject, setProjects, setNewDirectory, setShowEditDirectoryForm, setEditingDirectory, selectedDirectory, setSelectedDirectory);
  };

  // 取消目录编辑
  const handleCancelEditDirectory = () => {
    setShowEditDirectoryForm(false);
    setEditingDirectory(null);
    setNewDirectory({ name: '', description: '', parentId: null });
  };

  // 处理图片上传
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    uploadImage(file, setUploadingImage, setNewContent);
    // 清空input，允许重复上传同一文件
    e.target.value = '';
  };

  // 处理鼠标按下
  const handleMouseDown = (e, target, type) => {
    const timer = setTimeout(() => handleLongPress(e, target, type, setContextMenu), 500);
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
      }
    } else if (action === 'Export') {
      // 实现导出功能
      const success = exportToJson(target, type);
      if (success) {
        alert(`${type === 'project' ? 'Project' : (type === 'directory' ? 'Directory' : 'Content')} exported successfully as JSON`);
      }
    } else if (action === 'Copy') {
      // 处理复制功能
      setCopyTarget(target);
      setCopyType(type);
      // 设置默认复制项目为当前项目
      setSelectedCopyProject(selectedProject);
      // 设置默认复制目标为null，要求用户必须选择一个目录
      setSelectedCopyDestination(null);
      // 重置展开的目录
      setExpandedDirectories(new Set());
      setShowCopyDialog(true);
    }
    
    closeContextMenu();
  };

  // 处理确认操作
  const handleConfirmAction = async () => {
    if (!confirmAction || !user) return;
    
    const { action, type, target } = confirmAction;
    
    if (action === 'delete') {
      if (type === 'project') {
        await deleteProject(target, setProjects, selectedProject, setSelectedProject, setSelectedDirectory);
      } else if (type === 'directory') {
        if (!selectedProject) {
          alert('Please select a project first');
          setShowConfirmDialog(false);
          setConfirmAction(null);
          return;
        }
        await deleteDirectory(target, selectedProject, setProjects, fetchProjects, setSelectedProject, selectedDirectory, setSelectedDirectory);
      } else if (type === 'content') {
        if (!selectedProject || !selectedDirectory) {
          alert('Please select a project and directory first');
          setShowConfirmDialog(false);
          setConfirmAction(null);
          return;
        }
        await deleteContent(target, selectedProject, selectedDirectory, setProjects, fetchProjects, setSelectedProject, setSelectedDirectory, selectedContent, setSelectedContent);
      }
    }
    
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  // 处理复制操作
  const handleCopyAction = async () => {
    if (!copyTarget || !copyType || !selectedCopyDestination || !selectedCopyProject) {
      return;
    }

    let success = false;
    if (copyType === 'content') {
      success = await copyContent(copyTarget, selectedCopyProject, selectedCopyDestination, setProjects, fetchProjects, selectedProject, setSelectedProject, selectedDirectory, setSelectedDirectory);
    } else if (copyType === 'directory') {
      success = await copyDirectory(copyTarget, selectedCopyProject, selectedCopyDestination, setProjects, fetchProjects, selectedProject, setSelectedProject);
    }

    if (success) {
      // 关闭复制对话框
      setShowCopyDialog(false);
      setCopyTarget(null);
      setCopyType(null);
      setSelectedCopyProject(null);
      setSelectedCopyDestination(null);
      setExpandedDirectories(new Set());

      alert(`${copyType === 'content' ? 'Content' : 'Directory'} copied successfully`);
    }
  };

  // 处理选择项目
  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setSelectedDirectory(null);
    setSelectedContent(null);
    // 更新路由
    navigate(`/input/${project.id}`);
  };

  // 处理选择目录
  const handleSelectDirectory = (directory) => {
    setSelectedDirectory(directory);
    setSelectedContent(null);
    // 更新路由
    if (selectedProject) {
      navigate(`/input/${selectedProject.id}/${directory.id}`);
    }
  };

  // 处理选择内容
  const handleSelectContent = (content) => {
    setSelectedContent(content);
    // 更新路由
    if (selectedProject && selectedDirectory) {
      navigate(`/input/${selectedProject.id}/${selectedDirectory.id}/${content.id}`);
    }
  };

  // 切换目录表单显示
  const handleToggleDirectoryForm = () => {
    setShowDirectoryForm(!showDirectoryForm);
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
        <Sidebar 
          sidebarOpen={sidebarOpen}
          projects={projects}
          selectedProject={selectedProject}
          selectedDirectory={selectedDirectory}
          selectedContent={selectedContent}
          projectsCollapsed={projectsCollapsed}
          collapsedDirectories={collapsedDirectories}
          showDirectoryForm={showDirectoryForm}
          newDirectory={newDirectory}
          contents={selectedDirectory?.content || []}
          onSelectProject={handleSelectProject}
          onSelectDirectory={handleSelectDirectory}
          onSelectContent={handleSelectContent}
          onToggleProjectsCollapse={toggleProjectsCollapse}
          onToggleDirectoryCollapse={toggleDirectoryCollapse}
          onToggleDirectoryForm={handleToggleDirectoryForm}
          onSubmitDirectory={handleAddDirectory}
          setNewDirectory={setNewDirectory}
          onContextMenu={(e, target, type) => handleContextMenu(e, target, type, setContextMenu)}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          isNarrow={true}
        />

        {/* 右侧内容区域 */}
        <ContentArea 
          selectedProject={selectedProject}
          selectedDirectory={selectedDirectory}
          showContentForm={showContentForm}
          showEditContentForm={showEditContentForm}
          newContent={newContent}
          setNewContent={setNewContent}
          uploadingImage={uploadingImage}
          onSelectDirectory={handleSelectDirectory}
          onSelectContent={handleSelectContent}
          onAddContent={handleAddContent}
          onSubmitContent={handleSubmitContent}
          onCancelContent={handleCancelContent}
          onSubmitEditContent={handleUpdateContent}
          onCancelEditContent={handleCancelEditContent}
          onImageUpload={handleImageUpload}
          onContextMenu={handleContextMenu}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
      </div>

      {/* 右键菜单 */}
      {contextMenu.show && (
        <>
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
          <div className="context-menu-overlay" onClick={closeContextMenu} />
        </>
      )}

      {/* 创建项目对话框 */}
      <CreateProjectDialog 
        show={showProjectForm}
        onClose={() => setShowProjectForm(false)}
        onSubmit={handleSubmitProject}
        newProject={newProject}
        setNewProject={setNewProject}
      />

      {/* 编辑目录对话框 */}
      <EditDirectoryDialog 
        show={showEditDirectoryForm}
        onClose={handleCancelEditDirectory}
        onSubmit={handleUpdateDirectory}
        newDirectory={newDirectory}
        setNewDirectory={setNewDirectory}
      />

      {/* 确认对话框 */}
      <ConfirmDialog 
        show={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false);
          setConfirmAction(null);
        }}
        onConfirm={handleConfirmAction}
        confirmAction={confirmAction}
      />

      {/* 复制确认对话框 */}
      <CopyDialog 
        show={showCopyDialog}
        onClose={() => {
          setShowCopyDialog(false);
          setCopyTarget(null);
          setCopyType(null);
          setSelectedCopyProject(null);
          setSelectedCopyDestination(null);
          setExpandedDirectories(new Set());
        }}
        onCopy={handleCopyAction}
        copyTarget={copyTarget}
        copyType={copyType}
        projects={projects}
        selectedCopyProject={selectedCopyProject}
        setSelectedCopyProject={setSelectedCopyProject}
        selectedCopyDestination={selectedCopyDestination}
        setSelectedCopyDestination={setSelectedCopyDestination}
        expandedDirectories={expandedDirectories}
        setExpandedDirectories={setExpandedDirectories}
      />
    </div>
  );
};

export default LearningProjects;