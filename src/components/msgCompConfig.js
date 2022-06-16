// 组件可派发事件
export const events = [
];

// 组件可接收事件
export const actions = [
  {
    key: "searchCharcoalInfo",
    name: "炭资产报表查询",
    isSupportChild: false,
    params: [
      {
        name: "电站",
        key: "charcoalId",
        dataType: "string,number,objectArray",
      },
    ],
  },
];

export default {
  actions,
  events,
};
