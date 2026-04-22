import pluginSystem from './pluginSystem';
import examplePlugin from './examplePlugin';

// 注册所有插件
const registerPlugins = () => {
  pluginSystem.registerPlugin('example', examplePlugin);
  // 可以在这里注册更多插件
};

// 导出插件系统和注册函数
export { pluginSystem, registerPlugins };
export default pluginSystem;