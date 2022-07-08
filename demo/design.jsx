import React from "react";
import App from "../src/App";
import "./mockComponentCenter";
import "antd/dist/antd.css";
import { componentCenter, eventCenter } from "./mockComponentCenter";

const PreviewComponent = (props) => {
  const customConfig = {
    componentId: "111",
    formConfig: {},
    component: {},
    componentCenter,
    eventCenter,
  };
  return <App {...customConfig} type="list" />;
};

PreviewComponent.propTypes = {};

export default PreviewComponent;
