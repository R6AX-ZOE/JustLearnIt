import fs from 'fs';
import path from 'path';

const PROJECTS_FILE = path.join(process.cwd(), 'projects.json');

export const loadProjects = () => {
  try {
    if (fs.existsSync(PROJECTS_FILE)) {
      const data = fs.readFileSync(PROJECTS_FILE, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading projects:', error.message);
    return [];
  }
};

export const saveProjects = (projects) => {
  try {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
    console.log('Projects saved to file');
  } catch (error) {
    console.error('Error saving projects:', error.message);
  }
};
