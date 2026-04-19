import axios from 'axios';

// 工具函数

// 防抖函数
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// API调用函数

// 全局变量，用于跟踪最近的API请求时间
const lastFetchTimes = {};

// 获取项目列表
export const fetchProjects = async (userId, setProjects, forceRefresh = false) => {
  try {
    const now = Date.now();
    const cacheExpiry = 5 * 60 * 1000; // 5分钟缓存过期
    const requestThrottle = 1000; // 1秒内不重复请求
    
    // 检查请求节流
    if (!forceRefresh && lastFetchTimes[userId] && (now - lastFetchTimes[userId]) < requestThrottle) {
      console.log('Request throttled - skipping fetchProjects');
      return;
    }
    
    // 检查本地缓存
    const cachedData = localStorage.getItem(`projects_${userId}`);
    const cachedTimestamp = localStorage.getItem(`projects_${userId}_timestamp`);
    
    if (!forceRefresh && cachedData && cachedTimestamp && (now - parseInt(cachedTimestamp)) < cacheExpiry) {
      // 使用缓存数据
      console.log('Using cached projects data');
      setProjects(JSON.parse(cachedData));
      return; // 直接返回，不请求服务器
    }
    
    // 记录请求时间
    lastFetchTimes[userId] = now;
    
    // 从服务器获取最新数据
    console.log('Fetching projects from server');
    const response = await axios.get(`/api/learning/projects/${userId}`);
    const projects = response.data.projects;
    setProjects(projects);
    
    // 更新本地缓存，带有时间戳
    localStorage.setItem(`projects_${userId}`, JSON.stringify(projects));
    localStorage.setItem(`projects_${userId}_timestamp`, now.toString());
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
};

// 创建项目
export const createProject = async (userId, newProject, setProjects, setShowProjectForm) => {
  try {
    const response = await axios.post('/api/learning/projects', {
      userId: userId,
      name: newProject.name,
      overview: newProject.description
    });
    const updatedProjects = [...(JSON.parse(localStorage.getItem(`projects_${userId}`) || '[]')), response.data.project];
    setProjects(updatedProjects);
    // 更新本地缓存，带有时间戳
    localStorage.setItem(`projects_${userId}`, JSON.stringify(updatedProjects));
    localStorage.setItem(`projects_${userId}_timestamp`, Date.now().toString());
    setShowProjectForm(false);
  } catch (error) {
    console.error('Error creating project:', error);
    alert('Failed to create project');
  }
};

// 添加目录
export const addDirectory = async (selectedProject, newDirectory, setSelectedProject, setProjects, setNewDirectory, setShowDirectoryForm) => {
  try {
    const response = await axios.post(`/api/learning/project/${selectedProject.id}/directories`, newDirectory);
    // 使用后端返回的项目数据，确保数据一致性
    const updatedProject = response.data.project;
    setSelectedProject(updatedProject);
    
    // 更新项目列表
    const updatedProjects = [...(JSON.parse(localStorage.getItem(`projects_${updatedProject.userId}`) || '[]'))].map(p => p.id === updatedProject.id ? updatedProject : p);
    setProjects(updatedProjects);
    // 更新本地缓存，带有时间戳
    localStorage.setItem(`projects_${updatedProject.userId}`, JSON.stringify(updatedProjects));
    localStorage.setItem(`projects_${updatedProject.userId}_timestamp`, Date.now().toString());
    
    setNewDirectory({ name: '', description: '', parentId: null });
    setShowDirectoryForm(false);
  } catch (error) {
    console.error('Error adding directory:', error);
  }
};

// 添加内容
export const addContent = async (selectedProject, selectedDirectory, newContent, setSelectedProject, setProjects, setNewContent, setShowContentForm, setSelectedContent) => {
  try {
    const response = await axios.post(`/api/learning/project/${selectedProject.id}/directory/${selectedDirectory.id}/content`, newContent);
    // 使用后端返回的项目数据，确保数据一致性
    const updatedProject = response.data.project;
    
    if (updatedProject) {
      setSelectedProject(updatedProject);
      
      // 更新项目列表
      const updatedProjects = [...(JSON.parse(localStorage.getItem(`projects_${updatedProject.userId}`) || '[]'))].map(p => p.id === updatedProject.id ? updatedProject : p);
      setProjects(updatedProjects);
      // 更新本地缓存，带有时间戳
      localStorage.setItem(`projects_${updatedProject.userId}`, JSON.stringify(updatedProjects));
      localStorage.setItem(`projects_${updatedProject.userId}_timestamp`, Date.now().toString());
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

// 更新内容
export const updateContent = async (selectedProject, selectedDirectory, editingContent, newContent, setSelectedProject, setProjects, setNewContent, setShowEditContentForm, setEditingContent, setSelectedContent, setSelectedDirectory) => {
  try {
    const response = await axios.put(`/api/learning/project/${selectedProject.id}/directory/${selectedDirectory.id}/content/${editingContent.id}`, newContent);
    // 使用后端返回的项目数据，确保数据一致性
    const updatedProject = response.data.project;
    
    if (updatedProject) {
      setSelectedProject(updatedProject);
      
      // 更新项目列表
      const updatedProjects = [...(JSON.parse(localStorage.getItem(`projects_${updatedProject.userId}`) || '[]'))].map(p => p.id === updatedProject.id ? updatedProject : p);
      setProjects(updatedProjects);
      // 更新本地缓存，带有时间戳
      localStorage.setItem(`projects_${updatedProject.userId}`, JSON.stringify(updatedProjects));
      localStorage.setItem(`projects_${updatedProject.userId}_timestamp`, Date.now().toString());
      
      // 重新找到当前选中的目录，确保内容列表更新
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

// 更新目录
export const updateDirectory = async (selectedProject, editingDirectory, newDirectory, setSelectedProject, setProjects, setNewDirectory, setShowEditDirectoryForm, setEditingDirectory, selectedDirectory, setSelectedDirectory) => {
  try {
    const response = await axios.put(`/api/learning/project/${selectedProject.id}/directory/${editingDirectory.id}`, newDirectory);
    // 使用后端返回的项目数据，确保数据一致性
    const updatedProject = response.data.project;
    setSelectedProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    
    // 更新本地缓存，带有时间戳
    const currentProjects = JSON.parse(localStorage.getItem(`projects_${updatedProject.userId}`) || '[]');
    const updatedProjects = currentProjects.map(p => p.id === updatedProject.id ? updatedProject : p);
    localStorage.setItem(`projects_${updatedProject.userId}`, JSON.stringify(updatedProjects));
    localStorage.setItem(`projects_${updatedProject.userId}_timestamp`, Date.now().toString());
    
    // 如果当前选中的目录是被编辑的目录，更新它
    if (selectedDirectory?.id === editingDirectory.id) {
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

// 删除项目
export const deleteProject = async (target, setProjects, selectedProject, setSelectedProject, setSelectedDirectory) => {
  try {
    await axios.delete(`/api/learning/project/${target.id}`);
    setProjects(prev => prev.filter(p => p.id !== target.id));
    if (selectedProject?.id === target.id) {
      setSelectedProject(null);
      setSelectedDirectory(null);
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    alert('Failed to delete project');
  }
};

// 删除目录
export const deleteDirectory = async (target, selectedProject, setProjects, fetchProjects, setSelectedProject, selectedDirectory, setSelectedDirectory) => {
  try {
    await axios.delete(`/api/learning/project/${selectedProject.id}/directory/${target.id}`);
    
    // 删除成功后重新获取项目数据，fetchProjects已经会更新本地缓存和setProjects
    await fetchProjects(selectedProject.id, setProjects);
    
    // 从更新后的项目列表中找到当前项目
    const updatedProjects = JSON.parse(localStorage.getItem(`projects_${selectedProject.userId}`) || '[]');
    const updatedProject = updatedProjects.find(p => p.id === selectedProject.id);
    if (updatedProject) {
      setSelectedProject(updatedProject);
    }
    
    if (selectedDirectory?.id === target.id) {
      setSelectedDirectory(null);
    }
  } catch (error) {
    console.error('Error deleting directory:', error);
    alert('Failed to delete directory');
  }
};

// 删除内容
export const deleteContent = async (target, selectedProject, selectedDirectory, setProjects, fetchProjects, setSelectedProject, setSelectedDirectory, selectedContent, setSelectedContent) => {
  try {
    await axios.delete(`/api/learning/project/${selectedProject.id}/directory/${selectedDirectory.id}/content/${target.id}`);
    
    // 删除成功后重新获取项目数据，fetchProjects已经会更新本地缓存和setProjects
    await fetchProjects(selectedProject.id, setProjects);
    
    // 从更新后的项目列表中找到当前项目
    const updatedProjects = JSON.parse(localStorage.getItem(`projects_${selectedProject.userId}`) || '[]');
    const updatedProject = updatedProjects.find(p => p.id === selectedProject.id);
    if (updatedProject) {
      setSelectedProject(updatedProject);
      
      // 重新找到当前选中的目录
      const updatedDir = findDirectory(updatedProject.structure.directories, selectedDirectory.id);
      if (updatedDir) {
        setSelectedDirectory(updatedDir);
      }
    }
    
    if (selectedContent?.id === target.id) {
      setSelectedContent(null);
    }
  } catch (error) {
    console.error('Error deleting content:', error);
    alert('Failed to delete content');
  }
};

// 复制内容
export const copyContent = async (copyTarget, selectedCopyProject, selectedCopyDestination, setProjects, fetchProjects, selectedProject, setSelectedProject, selectedDirectory, setSelectedDirectory) => {
  try {
    const newContent = {
      title: copyTarget.title,
      content: copyTarget.content,
      images: copyTarget.images || []
    };

    // 确保目标目录ID有效
    const targetDirectoryId = selectedCopyDestination?.id;
    
    if (!targetDirectoryId) {
      alert('Please select a valid destination directory');
      return false;
    }

    const response = await axios.post(
      `/api/learning/project/${selectedCopyProject.id}/directory/${targetDirectoryId}/content`,
      newContent
    );

    console.log('Content copied successfully:', response.data);
    
    // 重新获取项目数据，fetchProjects已经会更新本地缓存和setProjects
    await fetchProjects(selectedCopyProject.id, setProjects);
    
    // 如果目标项目是当前选中的项目，更新它
    if (selectedProject?.id === selectedCopyProject.id) {
      // 从更新后的项目列表中找到当前项目
      const updatedProjects = JSON.parse(localStorage.getItem(`projects_${selectedCopyProject.userId}`) || '[]');
      const updatedProject = updatedProjects.find(p => p.id === selectedCopyProject.id);
      if (updatedProject) {
        setSelectedProject(updatedProject);

        // 如果当前选中的目录是目标目录，更新它
        if (selectedDirectory?.id === targetDirectoryId) {
          const updatedDir = findDirectory(updatedProject.structure.directories, targetDirectoryId);
          if (updatedDir) {
            setSelectedDirectory(updatedDir);
          }
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Error copying content:', error);
    alert('Failed to copy content');
    return false;
  }
};

// 复制目录
export const copyDirectory = async (copyTarget, selectedCopyProject, selectedCopyDestination, setProjects, fetchProjects, selectedProject, setSelectedProject) => {
  try {
    const copyDirectoryRecursive = async (dir, parentId) => {
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
          await copyDirectoryRecursive(subdir, createdDirectory.id);
        }
      }

      return createdDirectory;
    };

    // 对于目录复制，parentId为null表示复制到根级别
    // selectedCopyDestination为null时，表示用户选择复制到根级别
    const parentId = selectedCopyDestination?.id || null;
    
    await copyDirectoryRecursive(copyTarget, parentId);

    console.log('Directory copied successfully');
    
    // 重新获取项目数据，fetchProjects已经会更新本地缓存和setProjects
    await fetchProjects(selectedCopyProject.id, setProjects);
    
    // 如果目标项目是当前选中的项目，更新它
    if (selectedProject?.id === selectedCopyProject.id) {
      // 从更新后的项目列表中找到当前项目
      const updatedProjects = JSON.parse(localStorage.getItem(`projects_${selectedCopyProject.userId}`) || '[]');
      const updatedProject = updatedProjects.find(p => p.id === selectedCopyProject.id);
      if (updatedProject) {
        setSelectedProject(updatedProject);
      }
    }

    return true;
  } catch (error) {
    console.error('Error copying directory:', error);
    alert('Failed to copy directory');
    return false;
  }
};

// 上传图片
export const uploadImage = async (file, setUploadingImage, setNewContent) => {
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
  }
};

// 工具函数

// 递归查找目录
export const findDirectory = (directories, directoryId) => {
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

// 导出为JSON文件
export const exportToJson = (target, type) => {
  try {
    // 准备导出数据
    const exportData = {
      type: type,
      exportedAt: new Date().toISOString(),
      data: target
    };

    // 生成文件名
    const fileName = `${type}_${type === 'project' ? target.name : (type === 'directory' ? target.name : target.title)}_${Date.now()}.json`
      .replace(/[^a-zA-Z0-9_\-\. ]/g, '_')
      .replace(/\s+/g, '_');

    // 创建JSON字符串
    const jsonString = JSON.stringify(exportData, null, 2);

    // 创建Blob对象
    const blob = new Blob([jsonString], { type: 'application/json' });

    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;

    // 触发下载
    document.body.appendChild(link);
    link.click();

    // 清理
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);

    console.log('Exported successfully:', fileName);
    return true;
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    alert('Failed to export to JSON');
    return false;
  }
};

// 事件处理函数

// 处理右键菜单
export const handleContextMenu = (e, target, type, setContextMenu) => {
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

// 处理长按菜单
export const handleLongPress = (e, target, type, setContextMenu) => {
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