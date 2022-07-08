import React from "react";
import App from "../src/App";

const PreviewComponent = (props) => {
  const customConfig = {
    componentId: "111",
    data: "111",
    formConfig: {
    },
    component: {},
    configuration: '{"size":"large","placeholder":"33333","allowClear":true}',
  };
  return (
    <div>
      <App {...customConfig} type="table" />
      <br />
      <br />
      <div>回填值: {customConfig.data}</div>
    </div>
  );
};

PreviewComponent.propTypes = {};

export default PreviewComponent;
