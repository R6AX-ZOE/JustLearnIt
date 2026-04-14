import express from 'express';
import { loadProjects, saveProjects } from './projectStorage.js';

const router = express.Router();

// 学习项目存储（从文件加载）
let learningProjects = loadProjects();

// 保存项目的辅助函数
const persistProjects = () => {
  saveProjects(learningProjects);
};

// 创建学习项目
router.post('/projects', (req, res) => {
  try {
    const { name, overview, userId } = req.body;

    if (!name || !userId) {
      return res.status(400).json({ message: 'Name and userId are required' });
    }

    const newProject = {
      id: Date.now().toString(),
      name,
      overview: overview || '',
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      structure: {
        directories: []
      }
    };

    learningProjects.push(newProject);
    persistProjects();
    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 获取用户的学习项目
router.get('/projects/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const userProjects = learningProjects.filter(project => project.userId === userId);
    res.status(200).json({ projects: userProjects });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 获取用户的学习项目（基本信息）
router.get('/projects/:userId/basic', (req, res) => {
  try {
    const { userId } = req.params;
    const userProjects = learningProjects.filter(project => project.userId === userId);
    const basicProjects = userProjects.map(project => ({
      id: project.id,
      name: project.name,
      overview: project.overview,
      userId: project.userId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    }));
    res.status(200).json({ projects: basicProjects });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 获取单个学习项目
router.get('/project/:id', (req, res) => {
  try {
    const { id } = req.params;
    const project = learningProjects.find(project => project.id === id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json({ project });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 递归查找目录
const findDirectory = (directories, directoryId) => {
  for (const dir of directories) {
    if (dir.id === directoryId) {
      return dir;
    }
    if (dir.subdirectories) {
      const found = findDirectory(dir.subdirectories, directoryId);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

// 添加目录到学习项目
router.post('/project/:id/directories', (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, parentId } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Directory name is required' });
    }

    const project = learningProjects.find(project => project.id === id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const newDirectory = {
      id: Date.now().toString(),
      name,
      description: description || '',
      content: [],
      subdirectories: []
    };

    if (parentId) {
      const parentDirectory = findDirectory(project.structure.directories, parentId);
      if (parentDirectory) {
        parentDirectory.subdirectories.push(newDirectory);
      } else {
        return res.status(404).json({ message: 'Parent directory not found' });
      }
    } else {
      project.structure.directories.push(newDirectory);
    }

    project.updatedAt = new Date();
    persistProjects();

    res.status(201).json({ 
      message: 'Directory added successfully', 
      directory: newDirectory,
      project: project
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 添加内容到目录
router.post('/project/:projectId/directory/:directoryId/content', (req, res) => {
  try {
    const { projectId, directoryId } = req.params;
    const { title, content, images } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const project = learningProjects.find(project => project.id === projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const directory = findDirectory(project.structure.directories, directoryId);
    if (!directory) {
      return res.status(404).json({ message: 'Directory not found' });
    }

    const newContent = {
      id: Date.now().toString(),
      title,
      content,
      images: images || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    directory.content.push(newContent);
    project.updatedAt = new Date();
    persistProjects();

    res.status(201).json({ 
      message: 'Content added successfully', 
      content: newContent,
      project: project
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 更新内容
router.put('/project/:projectId/directory/:directoryId/content/:contentId', (req, res) => {
  try {
    const { projectId, directoryId, contentId } = req.params;
    const { title, content, images } = req.body;

    const project = learningProjects.find(project => project.id === projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const directory = findDirectory(project.structure.directories, directoryId);
    if (!directory) {
      return res.status(404).json({ message: 'Directory not found' });
    }

    const contentItem = directory.content.find(item => item.id === contentId);
    if (!contentItem) {
      return res.status(404).json({ message: 'Content not found' });
    }

    if (title) contentItem.title = title;
    if (content) contentItem.content = content;
    if (images) contentItem.images = images;
    contentItem.updatedAt = new Date();
    project.updatedAt = new Date();
    persistProjects();

    res.status(200).json({ message: 'Content updated successfully', content: contentItem, project: project });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 更新目录
router.put('/project/:projectId/directory/:directoryId', (req, res) => {
  try {
    const { projectId, directoryId } = req.params;
    const { name, description, parentId } = req.body;

    const project = learningProjects.find(project => project.id === projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // 查找要更新的目录
    const findDirectoryAndParent = (directories, dirId, parent = null) => {
      for (const dir of directories) {
        if (dir.id === dirId) {
          return { directory: dir, parent: parent };
        }
        if (dir.subdirectories) {
          const found = findDirectoryAndParent(dir.subdirectories, dirId, dir);
          if (found) return found;
        }
      }
      return null;
    };

    const { directory: directoryToUpdate, parent: oldParent } = findDirectoryAndParent(project.structure.directories, directoryId);
    if (!directoryToUpdate) {
      return res.status(404).json({ message: 'Directory not found' });
    }

    // 更新目录属性
    if (name) directoryToUpdate.name = name;
    if (description !== undefined) directoryToUpdate.description = description;

    // 如果需要移动目录（修改parentId）
    if (parentId !== undefined && parentId !== directoryToUpdate.parentId) {
      // 从原父目录中移除
      if (oldParent) {
        oldParent.subdirectories = oldParent.subdirectories.filter(dir => dir.id !== directoryId);
      } else {
        project.structure.directories = project.structure.directories.filter(dir => dir.id !== directoryId);
      }

      // 添加到新父目录
      directoryToUpdate.parentId = parentId;
      if (parentId) {
        const newParent = findDirectory(project.structure.directories, parentId);
        if (newParent) {
          newParent.subdirectories.push(directoryToUpdate);
        } else {
          return res.status(404).json({ message: 'New parent directory not found' });
        }
      } else {
        project.structure.directories.push(directoryToUpdate);
      }
    }

    project.updatedAt = new Date();
    persistProjects();

    res.status(200).json({ message: 'Directory updated successfully', directory: directoryToUpdate, project: project });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 删除内容
router.delete('/project/:projectId/directory/:directoryId/content/:contentId', (req, res) => {
  try {
    const { projectId, directoryId, contentId } = req.params;

    const project = learningProjects.find(project => project.id === projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const directory = findDirectory(project.structure.directories, directoryId);
    if (!directory) {
      return res.status(404).json({ message: 'Directory not found' });
    }

    const contentIndex = directory.content.findIndex(item => item.id === contentId);
    if (contentIndex === -1) {
      return res.status(404).json({ message: 'Content not found' });
    }

    directory.content.splice(contentIndex, 1);
    project.updatedAt = new Date();
    persistProjects();

    res.status(200).json({ message: 'Content deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 删除项目
router.delete('/project/:id', (req, res) => {
  try {
    const { id } = req.params;
    const projectIndex = learningProjects.findIndex(project => project.id === id);
    
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }

    learningProjects.splice(projectIndex, 1);
    persistProjects();
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 删除目录
router.delete('/project/:projectId/directory/:directoryId', (req, res) => {
  console.log('=== DELETE Directory Request ===');
  console.log('Project ID:', req.params.projectId);
  console.log('Directory ID:', req.params.directoryId);
  
  try {
    const { projectId, directoryId } = req.params;

    const project = learningProjects.find(project => project.id === projectId);
    console.log('Project found:', project ? project.name : 'Not found');
    
    if (!project) {
      console.log('Error: Project not found');
      return res.status(404).json({ message: 'Project not found' });
    }

    console.log('Project directories:', JSON.stringify(project.structure.directories, null, 2));

    // 递归删除目录
    const removeDirectory = (directories) => {
      const index = directories.findIndex(dir => dir.id === directoryId);
      if (index !== -1) {
        console.log('Directory found at index:', index);
        directories.splice(index, 1);
        return true;
      }
      for (const dir of directories) {
        if (dir.subdirectories && removeDirectory(dir.subdirectories)) {
          return true;
        }
      }
      return false;
    };

    if (removeDirectory(project.structure.directories)) {
      project.updatedAt = new Date();
      persistProjects();
      console.log('Directory deleted successfully');
      res.status(200).json({ message: 'Directory deleted successfully' });
    } else {
      console.log('Error: Directory not found');
      res.status(404).json({ message: 'Directory not found' });
    }
  } catch (error) {
    console.error('Error in delete directory:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;