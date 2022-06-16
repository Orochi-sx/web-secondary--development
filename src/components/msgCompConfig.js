// 组件可派发事件
export const events = [{}];

// 组件可接收事件
export const actions = [
  {
    key: "searchElectricInfo",
    name: "代收费月账单报表查询",
    isSupportChild: false,
    params: [
      {
        name: "电站",
        key: "electricId",
        dataType: "string,number,objectArray",
      },
    ],
  },
];

export default {
  actions,
  events,
};
