import React, { Component } from "react";
import { Button, Avatar } from "antd";
import { SearchOutlined } from "@ant-design/icons";
// import appService from "@njsdata/app-sdk";
import "./app.less";

export default class App extends Component {
  componentDidMount() {
    const events = [
      {
        key: "avatarClick",
        name: "头像点击",
        payload: [],
      },
    ];

    const actions = [
      {
        key: "messageSuccess",
        name: "成功提示",
      },
    ];
    this.props?.customConfig?.componentId &&
      window.componentCenter?.register(
        this.props?.customConfig?.componentId,
        "",
        this,
        {
          events,
          actions,
        }
      );
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

  // getData = () => {
  //   console.log(appService.getMenuData(), "菜单");
  //   console.log(appService.getPageData(), "页面");
  //   console.log(appService.getVariable(), "变量");
  // };

  do_EventCenter_messageSuccess() {
    alert("动作执行成功！");
  }

  // 逻辑控制用，不可删
  Event_Center_getName() {
    return "应用二开头部测试";
  }

  render() {
    const { customConfig } = this.props;
    const { componentId, title, url, imgUrl } = customConfig || {};
    return (
      <div className="app-list-head">
        <SearchOutlined className="head-icon" />
        <div className="head-title">{title || "标题"}</div>
        <Button
          className="head-button"
          onClick={() => {
            window.open(url || "http://baidu.com");
          }}
        >
          跳转
        </Button>

        <Avatar
          className="head-action"
          size={20}
          onClick={() => {
            window?.eventCenter?.triggerEvent(componentId, "avatarClick");
          }}
          src={
            imgUrl ||
            "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BB12cBeO.img"
          }
        />
      </div>
    );
  }
}
