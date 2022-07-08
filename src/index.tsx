/* 可以考虑在发布的代码里移除这个css */
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import styled from "styled-components";
// import { ResponseDataHoc } from "@sd-ui/custom-plugin";  // 响应式能力

// type ComponentType = "set" | "add" | "child" | "table" | "preview";

const AppContainer = styled.div`
  width: 80%;
  height: 300px;
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  & > * {
    margin-bottom: 15px;
    display: flex;
    & > .title {
      font-size: 18px;
      color: cornflowerblue;
      white-space: nowrap;
      width: 220px;
    }
  }
`;

/**
 * 生产打包时为了减少体积，不引入 antd.css (可节约 2.5M左右的包体积)
 * 生产包是当做 onemind 主站插件使用的，页面里已经有一份 ant.css 了，所以这里可以省去
 * 从功能通过 webpack.IgnorePlugin 插件实现，如果想要打入此 css，请在 webpack 配置中做修改。
 */
if (process.env.NODE_ENV !== "production") {
  require("antd/dist/antd.css");
}
// const componentId = window._form?.componentId;
// const wrapId = componentId;
// const wrapDiv = document.getElementsByClassName(wrapId)[0];

// const data = window._form?.data;
// const onChange = window._form?.onChange;
// const type = window._form?.type;

if (process.env.NODE_ENV !== "production") {
  // const allValue = {
  //   set: "",
  //   add: "",
  //   child: "",
  //   table: "",
  //   preview: "",
  // };

  // * set 设计页
  // * add 新增编辑主表
  // * child 新增编辑子表
  // * table 列表页
  // * preview 详情页

  const appArr = [
    { title: "设计页组件", type: "set" },
    { title: "新增/编辑 主表组件", type: "add" },
    { title: "新增/编辑 子表组件", type: "child" },
    { title: "列表页组件", type: "table" },
    { title: "详情页组件", type: "preview" },
  ];

  const customConfig = {
    componentId: "111",
    data: "111",
    saveValue: [],
    onChange: (values: any) => {
      console.log(values);
    },
  };

  ReactDOM.render(
    <AppContainer>
      {appArr.map((item, index) => {
        return (
          <div key={index}>
            <span className="title">{item.title}：</span>
            <App {...customConfig} type={item.type} />
          </div>
        );
      })}
    </AppContainer>,
    document.getElementById("root")
  );
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }

  window.CUSTOM_PLUGIN.set(
    process.env.CUSTOM_PLUGIN_ID,
    (dom: any, props: any, context: any, eventBus: any) => {
      // const pluginProps = {
      //   props,
      //   context,
      //   eventBus,
      // };

      props.setSetPluginProps((props:any)=>{
        console.log('new props', props);
        ReactDOM.render(<App {...context} {...props} />, dom);
      })
      // window.pubSub.subscribe(props.pluginId+ '_' + props.type, (props:any) => {
      //   console.log('new props', props);
      //   ReactDOM.render(<App {...context} {...props} />, dom);
      // } )
      ReactDOM.render(<App {...context} {...props} />, dom);
      // window.ReactDOM.render(ResponseDataHoc(pluginProps)(App), dom); // 响应式能力
    }
  );
}
