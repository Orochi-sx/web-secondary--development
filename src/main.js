import Vue from "vue";
import App from "./App.vue";
import { Input, Select, Option ,Tooltip } from "element-ui";
import "./index.css";

Vue.config.productionTip = false;
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Tooltip);


if (process.env.NODE_ENV !== "production") {
  const props = {
    nodeFieldList: {
      S2: {
        S2: [
          {
            displayed: 1,
            col_index: 1,
            asset_id: "2fd81d3f-6993-0e78-c308-0b06ed7836a8",
            col_name: "书名",
            col_datatype: 0,
            import_flag: false,
          },
          {
            displayed: 1,
            col_index: 2,
            asset_id: "2fd81d3f-6993-0e78-c308-0b06ed7836a8",
            col_name: "输出书名",
            col_datatype: 0,
            import_flag: false,
          },
        ],
      },
    },
    nodeInfoList: {
      S2: {
        image: "EN_0001_hover.png",
        img: "EN_0001.png",
        obj_id: "f4705e7a-4a08-4b89-9282-01e2b4ad9301",
        shape: "nodeDom",
        data: {
          basicattrs: {
            classname: "com.sdata.customize.dataflow.CustomizeNode",
          },
          detail: {
            currentStr:'',
            columns: [
              // {
              //   displayed: 1,
              //   col_index: 1,
              //   asset_id: "2fd81d3f-6993-0e78-c308-0b06ed7836a8",
              //   col_name: "书名",
              //   col_datatype: 0,
              //   import_flag: false,
              // },
            ],
            columns1:[
              
            ]
          },
          text: {
            internalName: "合并输出数据",
            code: "S2",
          },
        },
        label: "S2:合并输出数据",
        output: 999,
        input: 1,
        size: [55, 55],
        x: 605,
        y: 221,
        id: 2,
        nodeid: "EN_98745678a2",
      },
    },
    currentNode: "S2",
    nodeCode: "EN_98745678",
    obj_id: "f4705e7a-4a08-4b89-9282-01e2b4ad9301",
    updateNode: detail => {
      console.log(detail);
    },
  };
  new Vue({
    render: h => <App {...{ props }} />,
  }).$mount("#app");
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }

  window.CUSTOM_PLUGIN.set(
    process.env.VUE_APP_CUSTOM_PLUGIN_ID,
    (dom, props) => {
      if (dom.childNodes.length > 0) {
        dom.removeChild(dom.childNodes[0]);
      }
      const div = document.createElement("div");
      dom.appendChild(div);
      new Vue({
        render: h => <App {...{ props }} />,
      }).$mount(div);
    }
  );
}
