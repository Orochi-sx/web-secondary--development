/*
 * @Author: wangchengyuan
 * @Email: wangchengyuan@njsdata.com
 * @LastEditors: wangchengyuan
 * @Date: 2021-04-06 09:58:34
 * @LastEditTime: 2021-04-06 19:37:14
 * @FilePath: \om-app-plugin-react-boilerplate\src\index.js
 * @Description: 请描述文件作用
 */
/* 可以考虑在发布的代码里移除这个css */
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import {
  registerStore,
  getBlockData,
  getBlockVariables,
} from "@njsdata/bigscreen-sdk";
// import { ResponseDataHoc } from "@sd-ui/custom-plugin";

/**
 * 生产打包时为了减少体积，不引入 antd.css (可节约 2.5M左右的包体积)
 * 生产包是当做 onemind 主站插件使用的，页面里已经有一份 ant.css 了，所以这里可以省去
 * 从功能通过 webpack.IgnorePlugin 插件实现，如果想要打入此 css，请在 webpack 配置中做修改。
 */
if (process.env.NODE_ENV !== "production") {
  require("antd/dist/antd.css");
}

// 是否是生产环境
if (process.env.NODE_ENV !== "production") {
  const customConfig = {
    variable: { default_value: "测试的数据", id: "测试的ID" },
    options: {
      auto: true,
      showToolbar: false,
      columns: ["年份", "数值", "指标名称"],
      showColumns: ["年份", "指标名称"],
      dataSourceType: 2,
      customCss: "",
    },
    data: [
      [2018, 3.9, "新生儿死亡率"],
      [2018, 6.1, "婴儿死亡率"],
      [2018, 8.4, "5岁以下儿童死亡率"],
    ],
  };
  registerStore(customConfig);
  console.log(getBlockData(), "getBlockData");
  console.log(getBlockVariables(), "getBlockVariables");
  // 调试的时候使用
  ReactDOM.render(<App {...customConfig} />, document.getElementById("root"));
} else {
  // 提供给二开加载器的挂载方式
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }
  window.CUSTOM_PLUGIN.set(
    process.env.CUSTOM_PLUGIN_ID,
    (dom: any, props: any, context: any, eventBus: any) => {
      registerStore(props);
      // const pluginProps = {
      //   props,
      //   context,
      //   eventBus,
      // };
      ReactDOM.render(<App {...props} {...context} />, dom);
      return;
    }
  );
}
