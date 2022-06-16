// 组件可派发事件
export const events = [
  // {
  //   key: "onImgClick",
  //   name: "图片点击",
  //   payload: [
  //     {
  //       name: "内容",
  //       key: "value",
  //       dataType: "string",
  //     },
  //   ],
  // },
];

// 组件可接收事件
export const actions = [
  {
    key: "getId",
    name: "参数ID",
    isSupportChild: false,
    params: [
      {
        key: "id",
        name: "ID",
        dataType: "string,number,objectArray",
      }
    ],
  },
  // {
  //   key: "getIdArry",
  //   name: "参数ID数组",
  //   isSupportChild: false,
  //   params: [
  //     {
  //       key: "id",
  //       name: "ID",
  //       dataType: "number",
  //     }
  //   ],
  // },
];

export default {
  actions,
  events,
};
