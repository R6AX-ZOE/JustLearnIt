import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';

let deepseekApiKey = null;

// 读取API key
const loadApiKey = async () => {
  try {
    const apiKeyPath = path.resolve(process.cwd(), '.deepseek_api_key');
    const key = await fs.readFile(apiKeyPath, 'utf8');
    deepseekApiKey = key.trim();
    return deepseekApiKey;
  } catch (error) {
    console.error('Error loading DeepSeek API key:', error);
    return null;
  }
};

// 确保API key已加载
const ensureApiKey = async () => {
  if (!deepseekApiKey) {
    await loadApiKey();
  }
  return deepseekApiKey;
};

// DeepSeek API基础配置
const deepseekApi = axios.create({
  baseURL: 'https://api.deepseek.com/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器添加API key
deepseekApi.interceptors.request.use(
  async (config) => {
    const key = await ensureApiKey();
    if (key) {
      config.headers['Authorization'] = `Bearer ${key}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 聊天完成API
export const chatCompletion = async (messages, model = 'deepseek-chat') => {
  try {
    const response = await deepseekApi.post('/chat/completions', {
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1000
    });
    return response.data;
  } catch (error) {
    console.error('Error in DeepSeek chat completion:', error);
    throw error;
  }
};

// 嵌入API
export const createEmbedding = async (input, model = 'deepseek-embed') => {
  try {
    const response = await deepseekApi.post('/embeddings', {
      model,
      input
    });
    return response.data;
  } catch (error) {
    console.error('Error in DeepSeek embedding:', error);
    throw error;
  }
};

// 文本完成API
export const textCompletion = async (prompt, model = 'deepseek-r1') => {
  try {
    const response = await deepseekApi.post('/completions', {
      model,
      prompt,
      temperature: 0.7,
      max_tokens: 1000
    });
    return response.data;
  } catch (error) {
    console.error('Error in DeepSeek text completion:', error);
    throw error;
  }
};

export default {
  chatCompletion,
  createEmbedding,
  textCompletion,
  loadApiKey
};