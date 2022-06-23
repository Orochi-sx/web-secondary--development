/*
 * @Author: zhangzhuo
 * @Email: zhangzhuo@njsdata.com
 * @LastEditors: Do not edit
 * @Date: 2021-10-21 19:40:39
 * @LastEditTime: 2021-10-22 10:34:09
 * @Description: 请描述文件作用
 */
import Vue from "vue";
import App from "./App.vue";

import { Table, TableColumn, Dialog, Button,Pagination,Select,Option} from "element-ui";
import './index.css'

Vue.config.productionTip = false;
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Dialog);
Vue.use(Button);
Vue.use(Pagination);
Vue.use(Select);
Vue.use(Option);






import config from "../pluginTemp/config.json";

let { domId } = Object.values(config)[0];

let dom = document.getElementById(domId);

if (dom) {
  if (dom.childNodes.length > 0) {
    dom.removeChild(dom.childNodes[0]);
  }

  const App = require("./App.vue").default;
  let wrapper = document.createElement("div");
  wrapper.style = "width: 100%; height: 100%";
  dom.appendChild(wrapper);

  new Vue({
    render: h => h(App),
  }).$mount(wrapper);
} else {
  if (process.env.NODE_ENV !== "production") {
    const dataSource = JSON.parse(
      '[["order","xm","xb","yddh","事件数","人群分类","sfzh","zz","id"],[1,"王小虎","男","13777777777",1,"","320322************","南京**********",1],[1,"王小虎","男","13777777777",1,"","320322************","南京**********",1]]'
    );
    const options = {
      externalVariables: {
        echartsAssId:'16c91d9f-a606-4a81-9117-d1b3e0f72855',//关联的echats表id
        dioTableAssId:'2c491a44-d835-4794-9224-5b4d7f48d3b6',//关联的涉及事件表id
        mapValue:'sjid',//echart表映射字段
        tableMapValue:'sjid',//涉及事表里的映射字段
        filterStr:'事件类型'//筛选字段，目前没用
      },
    };
    const props = {
      dataSource,
      options,
    };
    const App = require("./App.vue").default;
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
}
