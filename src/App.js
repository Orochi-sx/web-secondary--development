import React, { Component } from "react";
import { Button, Card } from "antd";
import { PoweroffOutlined } from "@ant-design/icons";
import { logout, queryByProperty } from "./api/asset";
// import appService from "@njsdata/app-sdk";
import "./app.less";
const logoutSystem = () => {
  logout()
    .then((res) => {
      if (res.status == 200) {
        if (res.data) {
          console.log("res.data");
          window.location.replace(res.data);
        } else {
          console.log("Nores.data");
          window.location.reload();
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
export default class App extends Component {
  componentDidMount() {
    const events = [];

    const actions = [];
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
      <div className="mainTop" style={{ height: mainHeight ? mainHeight : "64px" }}>
        <div className="leftInfo">
          <img src={logoUrl} style={{ display: logoUrl ? "block" : "none" }} className="logo"></img>
          <img src={require("./assets/logo.png").default} style={{ display: logoUrl ? "none" : "block" }} className="logo"></img>
          <div className="title">{title ? title : "监管受理子系统"}</div>
        </div>
        <PoweroffOutlined onClick={logoutSystem} className="logout"></PoweroffOutlined>
      </div>
    );
  }
}
