import React, { Component } from "react";
import { PoweroffOutlined } from "@ant-design/icons";
import { logout } from "./api/asset";
// import appService from "@njsdata/app-sdk";
import "./app.less";
const logoutSystem = () => {
  logout().then((res) => {
    if (res.status === 200) {
      window.location.reload()
    }
  });
};
export default class App extends Component {
  componentDidMount() {
    const events = [

    ];

    const actions = [

    ];
    this.props?.customConfig?.componentId &&
      window.componentCenter?.register(this.props?.customConfig?.componentId, "", this, {
        events,
        actions,
      });
    // window.componentCenter.registerTriggerForType(
    //   this.props.componentId,
    //   "process",
    //   this,
    //   {
    //     events,
    //     actions,
    //   }
    // );
  }


  render() {
    const { customConfig } = this.props;
    const { logoUrl, title, mainHeight } = customConfig || {};
    return (
      <div className="mainTop" style={{ height: mainHeight || "64px" }}>
        <div className="leftInfo">
          <img src={logoUrl || require("./assets/logo.png").default} className="logo"></img>
          <h2 className="title">{title || "监管受理子系统"}</h2>
        </div>
        <PoweroffOutlined onClick={logoutSystem} className="logout"></PoweroffOutlined>
      </div>
    );
  }
}
