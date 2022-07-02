/* 可以考虑在发布的代码里移除这个css */
import React from "react";
import ReactDOM from "react-dom";
import App from './App'

import "./index.css";
import "./app.less";

/**
 * 生产打包时为了减少体积，不引入 antd.css (可节约 2.5M左右的包体积)
 * 生产包是当做 onemind 主站插件使用的，页面里已经有一份 ant.css 了，所以这里可以省去
 * 从功能通过 webpack.IgnorePlugin 插件实现，如果想要打入此 css，请在 webpack 配置中做修改。
 */
if (process.env.NODE_ENV !== "production") {
  require("antd/dist/antd.css");
}

let wrapId = window._appData?.id;
let wrapDiv = document.getElementsByClassName(wrapId)[0];

let dataOption = window._appData?.detail;
let customConfig = dataOption?.customizeDetail || {};
// console.log(wrapId, customConfig, 'customConfig')
if (wrapDiv) {
  ReactDOM.render(<App {...customConfig} />, wrapDiv);
} else {
  ReactDOM.render(<App {...customConfig} />, document.getElementById("root"));
}
