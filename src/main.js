import Vue from "vue";
import App from "./App.vue";
// 按需引入组件，引入方式见https://element.eleme.cn/#/zh-CN/component/quickstart#an-xu-yin-ru
import { Input, Select, Option, Button, Avatar, Tabs, TabPane, Radio, RadioGroup, RadioButton, DatePicker, Checkbox, CheckboxButton, Tag, CheckboxGroup } from "element-ui";

Vue.config.productionTip = false;
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Avatar);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(DatePicker);
Vue.use(Checkbox);
Vue.use(CheckboxButton);
Vue.use(CheckboxGroup);
Vue.use(Tag);

// import * as appService from "@njsdata/app-sdk";

if (process.env.NODE_ENV !== "production") {
  // 添加 customConfig 进行测试
  let customConfig = {
    title: "数据构建",
    desc: "无码化应用搭建，弹指间即完成数据从无到有到收集和使用",
    url: "http://baidu.com",
    imgUrl: "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png",
    chooseList: JSON.stringify([
      {
        noLimit: true,
        title: "课程系列课程",
        singleList: [{ label: "空1", key: "kong1" },{ label: "空2", key: "kong2" }],
        extra: "date",
        shortcutTime: true,
        fieldName: "seeion",
      },
      {
        noLimit: true,
        title: "课程系列",
        multipleList: [{ label: "空3", key: "kong3" },{ label: "空4", key: "kong4" }],
        extra: "date",
        fieldName: "fast",
      },
      {
        noLimit: true,
        title: "难度等级",
        multipleList: [{ label: "空5", key: "kong5" },{ label: "空6", key: "kong6" }],
        extra: "input",
        placeholder: "输入回车后确定",
        fieldName: "ation",
      },
      {
        noLimit: true,
        title: "课程系列",
        multipleList: [{ label: "一星", key: "1" },{ label: "二星", key: "2" },{ label: "三星", key: "3" }],
        extra: "select",
        options:[
          {
            key: "黄金糕",
            label: "黄金糕",
          },
          {
            key: "双皮奶",
            label: "双皮奶",
          },
          {
            key: "蚵仔煎",
            label: "蚵仔煎",
          },
          {
            key: "龙须面",
            label: "龙须面",
          },
          {
            key: "北京烤鸭",
            label: "北京烤鸭",
          },
        ],
        placeholder: "输入投资方名称",
        fieldName: "time",
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
    const customConfig = (props && props.customConfig) || {};
    const component = new Vue({
      render: (h) => <App customConfig={customConfig} info={props} />,
    }).$mount();
    if (dom.childNodes.length > 0) {
      dom.removeChild(dom.childNodes[0]);
    }
    dom.appendChild(component.$el);
  });
}
