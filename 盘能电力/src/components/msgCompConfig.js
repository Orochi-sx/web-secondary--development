// 组件可派发事件
export const events = [
  {
    key: "onImgClick",
    name: "图片点击",
    payload: [
      {
        name: "内容",
        key: "value",
        dataType: "string",
      },
    ],
  },
];

// 组件可接收事件
export const actions = [
  {
    key: "messageSuccess",
    name: "成功提示",
  },
];

export default {
  actions,
  events,
};
