/* 可以考虑在发布的代码里移除这个css */
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
/**
 * 生产打包时为了减少体积，不引入 antd.css (可节约 2.5M左右的包体积)
 * 生产包是当做 onemind 主站插件使用的，页面里已经有一份 ant.css 了，所以这里可以省去
 * 从功能通过 webpack.IgnorePlugin 插件实现，如果想要打入此 css，请在 webpack 配置中做修改。
 */

if (process.env.NODE_ENV !== "production") {
  require("antd/dist/antd.css");
  // 添加 customConfig 进行测试
  let customConfig = {
    appId: "",
    dataSouce:
      '[{"label":"开发插件","key":"item-1-7","roleList":["系统管理员","部门管理员"]},{"label":"逻辑切面","key":"item-1","roleList":["系统管理员","部门管理员"],"children":[{"label":"开发插件","key":"item-1-1","roleList":["超级管理员","部门管理员2"]},{"label":"使用插件","key":"item-1-2","roleList":["超级管理员","部门管理员"]},{"label":"JAVA SDK使用说明","key":"item-1-3","roleList":["超级管理员","部门管理员"]}]},{"label":"业务流开放","key":"item-2","roleList":["超级管理员","部门管理员"],"children":[{"label":"开发插件","key":"item-2-1","roleList":["超级管理员","部门管理员"]},{"label":"使用插件","key":"item-2-2","roleList":["超级管理员","部门管理员"]},{"label":"JAVA SDK使用说明","key":"item-2-3","roleList":["超级管理员","部门管理员"]}]}]',
  };
  ReactDOM.render(<App customConfig={customConfig} />, document.getElementById("root"));
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }

  window.CUSTOM_PLUGIN.set(process.env.CUSTOM_PLUGIN_ID, (dom, props) => {
    ReactDOM.render(<App {...props} />, dom);
  });
}
