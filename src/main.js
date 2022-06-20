import Vue from "vue";
import App from "./App.vue";
// 按需引入组件，引入方式见https://element.eleme.cn/#/zh-CN/component/quickstart#an-xu-yin-ru
import { Input, Select, Option, Button, Avatar, Radio, RadioGroup, RadioButton, Checkbox, CheckboxButton, CheckboxGroup, Divider } from "element-ui";

Vue.config.productionTip = false;
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Avatar);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Checkbox);
Vue.use(CheckboxButton);
Vue.use(CheckboxGroup);
Vue.use(Divider);
// import * as appService from "@njsdata/app-sdk";

if (process.env.NODE_ENV !== "production") {
  // 添加 customConfig 进行测试
  let customConfig = {
    chooseList: JSON.stringify([
      {
        assertsId: "59392489-f061-473e-96a8-f90c6e13c323",
        displayField: "name",
        valueField: "id",
        filterLabel: "省份",
        selectLimit: 1,
        sendField: "province",
        type: "2",
        child: {
          assertsId: "59392489-f061-473e-96a8-f90c6e13c323",
          displayField: "name",
          valueField: "id",
          filterLabel: "城市",
          sendField: "city",
          selectLimit: 1,
          type: "3",
          parent: "parent_id",
          child: {
            assertsId: "59392489-f061-473e-96a8-f90c6e13c323",
            displayField: "name",
            valueField: "id",
            filterLabel: "县区",
            sendField: "xianqu",
            selectLimit: 1,
            type: "4",
            parent: "parent_id",
          },
        },
      },
      {
        assertsId: "ca2e5dbe-b259-458f-b87f-3f9e6af995eb",
        displayField: "label",
        valueField: "id",
        selectLimit: 1,
        sendField: "gongzhong",
        filterLabel: "工种",
        type:1,
        child: {
          assertsId: "ca2e5dbe-b259-458f-b87f-3f9e6af995eb",
          displayField: "label",
          valueField: "id",
          filterLabel: "分类",
          sendField: "classification",
          selectLimit: 1,
          type:2,
          parent: "parent_id",
        },
      },
    ]),
  };

  new Vue({
    render: (h) => {
      return <App customConfig={customConfig} />;
    },
  }).$mount("#app");
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }

  window.CUSTOM_PLUGIN.set(process.env.VUE_APP_CUSTOM_PLUGIN_ID, (dom, props) => {
    if (dom.childNodes.length > 0) {
      dom.removeChild(dom.childNodes[0]);
    }
    const div = document.createElement("div");
    dom.appendChild(div);
    new Vue({
      render: (h) => <App {...{ props }} />,
    }).$mount(div);
  });
}
