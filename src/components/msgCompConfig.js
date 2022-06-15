// 组件可派发事件
export const events = [
  {
    key: "clickOption",
    name: "筛选点击",
    payload: [
      {
        name: "选中的值",
        key: "value",
        dataType: "objectArray",
      },
    ],
  },
];

// 组件可接收事件
export const actions = [
 
];

export default {
  actions,
  events,
};
