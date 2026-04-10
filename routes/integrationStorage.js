import fs from 'fs';
import path from 'path';

const INTEGRATION_FILE = path.join(process.cwd(), 'integration.json');

export const loadIntegration = () => {
  try {
    if (fs.existsSync(INTEGRATION_FILE)) {
      const data = fs.readFileSync(INTEGRATION_FILE, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading integration:', error.message);
    return [];
  }
};

export const saveIntegration = (integration) => {
  try {
    fs.writeFileSync(INTEGRATION_FILE, JSON.stringify(integration, null, 2));
    console.log('Integration saved to file');
  } catch (error) {
    console.error('Error saving integration:', error.message);
  }
};
