import React from "react";
import List from "../src/components/list/index";
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
  return <List {...customConfig} type="set" />;
};

PreviewComponent.propTypes = {};

export default PreviewComponent;
