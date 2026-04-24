// 插件系统核心
class PluginSystem {
  constructor() {
    this.plugins = new Map();
    this.loadedPlugins = new Set();
  }

  // 注册插件
  registerPlugin(name, plugin) {
    if (!name || !plugin) {
      throw new Error('Plugin name and definition are required');
    }
    
    if (this.plugins.has(name)) {
      console.warn(`Plugin ${name} is already registered`);
      return;
    }
    
    this.plugins.set(name, plugin);
    console.log(`Plugin ${name} registered`);
  }

  // 加载插件
  async loadPlugin(name) {
    if (!this.plugins.has(name)) {
      // 尝试自动注册插件
      try {
        let plugin;
        switch (name) {
          case 'example':
            plugin = (await import('./examplePlugin.js')).default;
            break;
          case 'review':
            plugin = (await import('./reviewPlugin.js')).default;
            break;
          default:
            throw new Error(`Plugin ${name} not found`);
        }
        this.registerPlugin(name, plugin);
      } catch (error) {
        throw new Error(`Plugin ${name} not found`);
      }
    }
    
    if (this.loadedPlugins.has(name)) {
      console.log(`Plugin ${name} is already loaded`);
      return this.plugins.get(name);
    }
    
    const plugin = this.plugins.get(name);
    
    // 处理依赖
    if (plugin.dependencies && plugin.dependencies.length > 0) {
      for (const depName of plugin.dependencies) {
        if (!this.loadedPlugins.has(depName)) {
          await this.loadPlugin(depName);
        }
      }
    }
    
    // 初始化插件
    if (plugin.init) {
      try {
        await plugin.init();
      } catch (error) {
        console.error(`Error initializing plugin ${name}:`, error);
        return null;
      }
    }
    
    this.loadedPlugins.add(name);
    console.log(`Plugin ${name} loaded`);
    return plugin;
  }

  // 加载所有插件
  async loadAllPlugins() {
    const pluginNames = Array.from(this.plugins.keys());
    for (const name of pluginNames) {
      await this.loadPlugin(name);
    }
  }

  // 获取插件
  getPlugin(name) {
    if (!this.loadedPlugins.has(name)) {
      throw new Error(`Plugin ${name} is not loaded`);
    }
    return this.plugins.get(name);
  }

  // 执行插件方法
  async executePluginMethod(pluginName, methodName, ...args) {
    const plugin = this.getPlugin(pluginName);
    if (!plugin.methods || !plugin.methods[methodName]) {
      throw new Error(`Method ${methodName} not found in plugin ${pluginName}`);
    }
    
    try {
      // 绑定this到插件实例
      return await plugin.methods[methodName].call(plugin, ...args);
    } catch (error) {
      console.error(`Error executing method ${methodName} in plugin ${pluginName}:`, error);
      throw error;
    }
  }

  // 获取所有已加载的插件
  getLoadedPlugins() {
    return Array.from(this.loadedPlugins);
  }

  // 卸载插件
  unloadPlugin(name) {
    if (!this.loadedPlugins.has(name)) {
      console.warn(`Plugin ${name} is not loaded`);
      return;
    }
    
    const plugin = this.plugins.get(name);
    if (plugin.destroy) {
      try {
        plugin.destroy();
      } catch (error) {
        console.error(`Error destroying plugin ${name}:`, error);
      }
    }
    
    this.loadedPlugins.delete(name);
    console.log(`Plugin ${name} unloaded`);
  }
}

// 导出插件系统实例
const pluginSystem = new PluginSystem();
export default pluginSystem;

// 插件模板
export const createPlugin = (name, options = {}) => {
  return {
    name,
    dependencies: options.dependencies || [],
    init: options.init || null,
    destroy: options.destroy || null,
    methods: options.methods || {},
    // 插件上下文
    context: {
      // DOM 操作方法
      dom: {
        querySelector: (selector) => document.querySelector(selector),
        querySelectorAll: (selector) => document.querySelectorAll(selector),
        createElement: (tag) => document.createElement(tag),
        appendChild: (parent, child) => parent.appendChild(child),
        removeChild: (parent, child) => parent.removeChild(child),
        setAttribute: (element, name, value) => element.setAttribute(name, value),
        getAttribute: (element, name) => element.getAttribute(name),
        addEventListener: (element, event, handler) => element.addEventListener(event, handler),
        removeEventListener: (element, event, handler) => element.removeEventListener(event, handler)
      },
      // API 访问方法
      api: {
        fetch: async (url, options = {}) => {
          try {
            const response = await fetch(url, options);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
          } catch (error) {
            console.error('API fetch error:', error);
            throw error;
          }
        },
        // 特定于练习系统的 API
        practice: {
          submitAnswer: async (questionId, answer) => {
            const response = await fetch(`/api/practice/question/${questionId}/submit`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ answer })
            });
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
          }
        }
      },
      // 工具方法
      utils: {
        // 深拷贝
        deepClone: (obj) => JSON.parse(JSON.stringify(obj)),
        // 防抖
        debounce: (func, wait) => {
          let timeout;
          return function executedFunction(...args) {
            const later = () => {
              clearTimeout(timeout);
              func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
          };
        },
        // 节流
        throttle: (func, limit) => {
          let inThrottle;
          return function(...args) {
            if (!inThrottle) {
              func.apply(this, args);
              inThrottle = true;
              setTimeout(() => inThrottle = false, limit);
            }
          };
        }
      }
    }
  };
};