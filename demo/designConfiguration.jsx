import React from "react";
import App from "../src/App";
import "./mockComponentCenter";

const DesignConfiguration = (props) => {
  const customConfig = {
    componentId: "111",
    formConfig: {},
    component: {},
    changeConfiguration: (values) => console.log(values),
    configuration: '{}',
  };
  return <App {...customConfig} type="designConfiguration" />;
};

DesignConfiguration.propTypes = {};

export default DesignConfiguration;
