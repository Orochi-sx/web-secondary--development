import Vue from "vue";
import App from "./App.vue";
// 按需引入组件，引入方式见https://element.eleme.cn/#/zh-CN/component/quickstart#an-xu-yin-ru
import {
  Input,
  Select,
  Option,
  Button,
  Table,
  TableColumn,
  Pagination,
  Checkbox
} from "element-ui";

Vue.config.productionTip = false;
Vue.use(Input);
Vue.use(Select);
Vue.use(Checkbox);
Vue.use(Option);
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);

if (process.env.NODE_ENV !== "production") {
  // 添加 customConfig 进行测试
  let customConfig = {
    title: "技术服务委托",
    buttonTitle: '新增委托',
    tableDisplayFieldName: "name,age,sex",
    assetId: "f8ccf4c3-48ad-41c8-8b02-83f58afddc84",
    sortConfig:'age',//排序字段配置
    sortType:'ascending',
    inputSelectConfig: JSON.stringify({
      input: ['age'], select: [
        {
          displayField: 'sex11', valueField: 'sex',selectAssetId: "96d5b7f6-f457-4e74-b44e-ce83ec102313",mapField:'sex'
        }, {
          displayField: 'name111', valueField: 'name',selectAssetId:'cbc4108d-3f83-46cc-a349-8ab22ca2da5f',mapField:'name'
        }
      ]
    }),
    data: JSON.parse('[["资产名称","目录"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有城镇资产资产","是222222国有"],["私有城镇资产","是11111私有"]]'),
    dataTwo: JSON.parse('[["资产名称22222","目录"],["国有农村资产222222","是11111111国有"],["国有城镇资产资产222222","是222222国有"],["私有城镇资产222222","是11111私有"]]')
  };
  new Vue({
    render: h => {
      return <App customConfig={customConfig}/>;
    },
  }).$mount("#app");
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }

  window.CUSTOM_PLUGIN.set(process.env.VUE_APP_CUSTOM_PLUGIN_ID, (dom, props) => {
    const customConfig = (props && props.customConfig) || {};
    const component = new Vue({
      render: h => <App customConfig={customConfig} info={props}/>,
    }).$mount();
    if (dom.childNodes.length > 0) {
      dom.removeChild(dom.childNodes[0]);
    }
    dom.appendChild(component.$el);
  });
}
