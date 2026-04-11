import express from 'express';
import { loadIntegration, saveIntegration } from './integrationStorage.js';

const router = express.Router();

let integrationData = loadIntegration();

const persistIntegration = () => {
  saveIntegration(integrationData);
};

router.get('/projects/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const userProjects = integrationData.filter(project => project.userId === userId);
    res.status(200).json({ projects: userProjects });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all projects for a user with only basic information
router.get('/projects/:userId/basic', (req, res) => {
  try {
    const { userId } = req.params;
    const userProjects = integrationData.filter(project => project.userId === userId);
    const basicProjects = userProjects.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      userId: project.userId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    }));
    res.status(200).json({ projects: basicProjects });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/project/:id', (req, res) => {
  try {
    const { id } = req.params;
    const project = integrationData.find(project => project.id === id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json({ project });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/projects', (req, res) => {
  try {
    const { name, description, userId } = req.body;
    if (!name || !userId) {
      return res.status(400).json({ message: 'Name and userId are required' });
    }

    const newProject = {
      id: Date.now().toString(),
      name,
      description: description || '',
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      graphs: [
        {
          id: '1',
          name: 'Main Graph',
          description: 'Default graph',
          nodes: [],
          edges: []
        }
      ]
    };

    integrationData.push(newProject);
    persistIntegration();
    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/project/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, graphs } = req.body;

    const projectIndex = integrationData.findIndex(project => project.id === id);
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (name !== undefined) integrationData[projectIndex].name = name;
    if (description !== undefined) integrationData[projectIndex].description = description;
    if (graphs !== undefined) integrationData[projectIndex].graphs = graphs;
    
    integrationData[projectIndex].updatedAt = new Date();
    persistIntegration();

    res.status(200).json({ message: 'Project updated successfully', project: integrationData[projectIndex] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/project/:projectId/graph/:graphId', (req, res) => {
  try {
    const { projectId, graphId } = req.params;
    const { nodes, edges, name, description } = req.body;

    const projectIndex = integrationData.findIndex(project => project.id === projectId);
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const graphIndex = integrationData[projectIndex].graphs.findIndex(g => g.id === graphId);
    if (graphIndex === -1) {
      return res.status(404).json({ message: 'Graph not found' });
    }

    if (nodes !== undefined) integrationData[projectIndex].graphs[graphIndex].nodes = nodes;
    if (edges !== undefined) integrationData[projectIndex].graphs[graphIndex].edges = edges;
    if (name !== undefined) integrationData[projectIndex].graphs[graphIndex].name = name;
    if (description !== undefined) integrationData[projectIndex].graphs[graphIndex].description = description;

    integrationData[projectIndex].updatedAt = new Date();
    persistIntegration();

    res.status(200).json({ 
      message: 'Graph updated successfully', 
      project: integrationData[projectIndex],
      graph: integrationData[projectIndex].graphs[graphIndex] 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/project/:id', (req, res) => {
  try {
    const { id } = req.params;
    const projectIndex = integrationData.findIndex(project => project.id === id);
    
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }

    integrationData.splice(projectIndex, 1);
    persistIntegration();
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all graphs for a project
router.get('/project/:projectId/graphs', (req, res) => {
  try {
    const { projectId } = req.params;
    const project = integrationData.find(project => project.id === projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ graphs: project.graphs || [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a single graph
router.get('/project/:projectId/graph/:graphId', (req, res) => {
  try {
    const { projectId, graphId } = req.params;
    const project = integrationData.find(project => project.id === projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const graph = project.graphs.find(g => g.id === graphId);
    if (!graph) {
      return res.status(404).json({ message: 'Graph not found' });
    }

    res.status(200).json({ graph });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new graph
router.post('/project/:projectId/graphs', (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const project = integrationData.find(project => project.id === projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const newGraph = {
      id: Date.now().toString(),
      name,
      description: description || '',
      nodes: [],
      edges: []
    };

    if (!project.graphs) {
      project.graphs = [];
    }

    project.graphs.push(newGraph);
    project.updatedAt = new Date();
    persistIntegration();

    res.status(201).json({ 
      message: 'Graph created successfully', 
      project,
      graph: newGraph 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a graph
router.delete('/project/:projectId/graph/:graphId', (req, res) => {
  try {
    const { projectId, graphId } = req.params;
    const project = integrationData.find(project => project.id === projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const graphIndex = project.graphs.findIndex(g => g.id === graphId);
    if (graphIndex === -1) {
      return res.status(404).json({ message: 'Graph not found' });
    }

    project.graphs.splice(graphIndex, 1);
    project.updatedAt = new Date();
    persistIntegration();

    res.status(200).json({ 
      message: 'Graph deleted successfully', 
      project 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
