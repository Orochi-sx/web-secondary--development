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
        assertsId: "c0581836-ba87-4c7d-8641-75cae207a75b",
        displayField: "gongzhong",
        valueField: "gongzhongdata",
        selectLimit: 4,
        sendField: "gongzhong",
        filterLabel: "工种",
        child: {
          assertsId: "da65d2a4-0e28-4405-9892-aaa8beafcf0f",
          displayField: "fenlei",
          valueField: "fenleidata",
          filterLabel: "分类",
          sendField: "fenlei",
          selectLimit: 4,
          parent: "parent_id",
        },
      },
      {
        assertsId: "1513493b-9b77-4a30-ad18-8e496eb5ee20",
        displayField: "labelName1",
        valueField: "data_id",
        filterLabel: "省份",
        selectLimit: 1,
        sendField: "province",
        child: {
          assertsId: "1133f13f-b21e-4337-b7f6-26e1bf19a379",
          displayField: "labelName2222",
          valueField: "data_id222",
          filterLabel: "城市",
          sendField: "city",
          selectLimit: 1,
          parent: "parent_id",
          child: {
            assertsId: "a8a10b73-a766-40c0-8357-8fba067e603c",
            displayField: "labelName",
            valueField: "data_id",
            filterLabel: "区县",
            selectLimit: 4,
            sendField: "county",
            parent: "parent_id",
            child: {
              assertsId: "c54588ad-a086-4426-849e-42292e6ed0cc",
              displayField: "labelName",
              valueField: "data_id",
              filterLabel: "街道",
              sendField: "street",
              selectLimit: 4,
              parent: "parent_id",
            },
          },
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
