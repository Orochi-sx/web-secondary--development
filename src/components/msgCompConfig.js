// 组件可派发事件
export const events = [
  {
    key: "getDetaiAddress",
    name: "获取详细位置",
    payload: [
      {
        name: "乡镇",
        key: "townShip",
        dataType: "string",
      },
      {
        name: "详细位置",
        key: "detailAddress",
        dataType: "string",
      },
      {
        name: "经度",
        key: "lng",
        dataType: "string",
      },
      {
        name: "纬度",
        key: "lat",
        dataType: "string",
      },
    ],
  },
  {
    key: "getDrawPolyline",
    name: "获取路线长度",
    payload: [
      {
        name: "路线长度",
        key: "length",
        dataType: "string",
      },
    ],
  },
];

// 组件可接收事件
export const actions = [
  {
    key: "changeCenterPoint",
    name: "改变地图中心点",
    isSupportChild: false,
    params: [
      {
        key: "mapLng",
        name: "经度",
        dataType: "string",
      },
      {
        key: "mapLat",
        name: "纬度",
        dataType: "string",
      },
    ],
  },
  {
    key: "loadMap",
    name: "刷新地图",
    isSupportChild: false,
    params: [
      {
        key: "mapLng",
        name: "经度",
        dataType: "string",
      },
      {
        key: "mapLat",
        name: "纬度",
        dataType: "string",
      },
    ],
  },
];

export default {
  actions,
  events,
};
