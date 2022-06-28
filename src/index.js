/*
 * @Author: wangchengyuan
 * @Email: wangchengyuan@njsdata.com
 * @LastEditors: Do not edit
 * @Date: 2021-04-06 09:58:34
 * @LastEditTime: 2021-10-19 17:43:29
 * @FilePath: \om-app-plugin-react-boilerplate\src\index.js
 * @Description: 请描述文件作用
 */
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
  const dataSource = JSON.parse('[["企业名","碳排放量","排放强度"],["长江电力有限公司","0","50"],["水泥有限公司","60","42"],["开心麻花有限公司","34","51"],["欢乐喜剧人剧场","25","64"],["水力水电股份公司","42","20"],["测试企业","65","15"],["文化企业","68","34"]]')
  
  const options = {
    externalVariables: {
      colorConfig:'red,blue,yellow,aqua,brown,blueviolet,chartreuse',
      sectorName:'高排低效1,低排低效1,低排高效1,高排高效1',
      sectorColor:'[{"color":"blue","opacity":0.3},{"color":"red","opacity":0.3},{"color":"blue","opacity":0.3},{"color":"red","opacity":0.3}]',
      centerColor:'blue',
      yMax:100,
      yMin:0,
      titleText:'象限图',
      titleColor:'#000000',
      titleSize:18
    },
  };
  ReactDOM.render(
    <App dataSource={dataSource} options={options} />,
    document.getElementById("root")
  );
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }
  window.CUSTOM_PLUGIN.set(process.env.CUSTOM_PLUGIN_ID, (dom, props) => {
    ReactDOM.render(<App {...props} />, dom);
  });
}
