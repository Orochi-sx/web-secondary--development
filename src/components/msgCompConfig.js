// 组件可派发事件
export const events = [
  {
    key: "treeNodeClick",
    name: "树形组件点击",
    payload: [
      {
        name: "当前选中节点ID",
        key: "dataId",
        dataType: "string",
      },
      {
        name: "当前选中节点名称",
        key: "name",
        dataType: "string",
      },
      {
        name: "当前选中节点父级ID",
        key: "parentId",
        dataType: "string",
      },
      {
        name: "当前选中节点列表ID",
        key: "listId",
        dataType: "string",
      }
    ],
  }
];

// 组件可接收事件
export const actions = [
  {
    key: "getId",
    name: "默认选中ID",
    isSupportChild: false,
    params: [
      {
        key: "id",
        name: "ID",
        dataType: "string",
      }
    ],
  },
];

export default {
  actions,
  events,
};
