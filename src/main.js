import Vue from "vue";
import App from "./App.vue";
// 按需引入组件，引入方式见https://element.eleme.cn/#/zh-CN/component/quickstart#an-xu-yin-ru
import {
  Button,
  Tooltip,
  Input,
  Select,
  Option,
  Form,
  FormItem,
  RadioGroup,
  RadioButton,
  Switch,
  Cascader,
} from "element-ui";
import "./index.css";
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import AMapLoader from '@amap/amap-jsapi-loader'

Vue.config.productionTip = false;

Vue.prototype.AMapLoader = AMapLoader

Vue.use(Button);
Vue.use(Tooltip);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Switch);
Vue.use(Cascader);

// Vue.use(Element);

if (process.env.NODE_ENV !== "production") {
  const appArr = [
    { title: "设计页组件", type: "set" },
    { title: "设计页属性组件", type: "designConfiguration" },
    { title: "新增/编辑 主表组件", type: "add" },
    { title: "新增/编辑 主表多字段组件", type: "addMultiple" },
    { title: "新增/编辑 子表组件", type: "child" },
    { title: "列表页组件", type: "table" },
    { title: "详情页组件", type: "preview" },
  ];

  const customConfig = {
    componentId: "111",
    data: "111",
    saveValue: [],
    component: {
      columnStyle: {
        title: "二开测试title",
      },
    },

    formConfig: {
      form_name: "二开数据",
    },
    onChange: values => {
      console.log(values);
    },
    changeConfiguration: values => {
      console.log(values);
    },
    configuration: '{"mapWidth": "100%", "mapHeight": "500px", "mapCityCenter":["118.432581,32.423072"]}',
  };

  new Vue({
    render: h => {
      return (
        <div class="app-container">
          {appArr.map((item, index) => {
            return (
              <div class="components">
                <span class="title">{item.title}：</span>
                <App
                  style={{ width: "calc(100% - 220px)"}}
                  customConfig={customConfig}
                  type={item.type}
                />
              </div>
            );
          })}
        </div>
      );
    },
  }).$mount("#app");
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }

  window.CUSTOM_PLUGIN.set(
    process.env.VUE_APP_CUSTOM_PLUGIN_ID,
    (dom, props) => {
      const component = new Vue({
        render: h => <App type={props.type} customConfig={props} />,
      }).$mount();
      if (dom.childNodes.length > 0) {
        dom.removeChild(dom.childNodes[0]);
      }
      dom.appendChild(component.$el);
    }
  );
}
