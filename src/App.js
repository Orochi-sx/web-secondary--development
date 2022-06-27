import React, { Component, useEffect, useState } from "react";
import {  Menu } from "antd";
import { user } from "./api/asset";
import "./app.less";
export const cleanObject = (obj) => Object.entries(obj).reduce((prev, [key, value]) => (value === undefined ? prev : { ...prev, [key]: value }), {});
const App = (props) => {
  const { customConfig } = props;
  const { componentId, dataSouce, appId } = customConfig || {};
  const rootSubmenuKeys = [];
  const [userInfo, setUserInfo] = useState({});
  const [message, setMessage] = useState(JSON.parse(dataSouce));
  const [toParseDataSouce, setToParseDataSouce] = useState([
    {
      label: "初始菜单",
      key: "default",
    },
  ]);
  useEffect(() => {
    const events = [
    
    ];
    const actions = [
     
    ];
    onlyShowOne(toParseDataSouce);
    userinfo();
    props?.customConfig?.componentId &&
      window.componentCenter?.register(props?.customConfig?.componentId, "", this, {
        events,
        actions,
      });
  }, []);
  const reloadView = (item, key, keyPath, domEvent) => {
    if (item.key !== "default") {
      window?.clickMenu({ key: item.key, isSubMenu: item.children ? false : true });
    }
  };
  function ergodicList(data, message) {
    data.forEach((item, index) => {
      let role = message.roleNameList.concat(item.roleList);
      let setrole = new Set(role);
      if (setrole.size === role.length) {
        data.splice(index, 1);
        return ergodicList(data, message);
      }
      if (item.children) {
        ergodicList(item.children, message);
      }
    });
  }
  function userinfo() {
    user()
      .then((res) => {
        if (res.status === 200) {
          setUserInfo(res.data);
          const messageUesrDate = res.data;
          ergodicList(message, messageUesrDate);
          message.forEach((item, index) => {
            if (item.children && item.children.length === 0) {
              message.splice(index, 1);
            }
          });
          if (message.length > 0) {
            setToParseDataSouce(message);
          }
        }
      })
      .catch((res) => {
        console.log(res);
      });
  }
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  const onlyShowOne = (toParseDataSouce) => {
    toParseDataSouce.forEach((item, index) => {
      if (item.key) {
        rootSubmenuKeys.push(item.key);
      }
    });
  };
  const [openKeys, setOpenKeys] = React.useState([toParseDataSouce[0].key]);

  return (
    <>
      <div className="userInfo">
        <div className="userInfoLeft">
          <img src={userInfo.photo} className="userHead"></img>
        </div>
        <div className="userInfoRight">
          <span>{userInfo.name}</span>
          <span>您好，欢迎使用</span>
        </div>
      </div>
      <div id="customHeadAndSide">
        <Menu
          mode="inline"
          defaultOpenKeys={rootSubmenuKeys}
          onOpenChange={onOpenChange}
          theme="dark"
          onClick={reloadView}
          style={{
            width: 256,
          }}
          items={toParseDataSouce}
        />
      </div>
    </>
  );
};

export default App;
