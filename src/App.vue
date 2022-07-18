<template>
  <div class="nanShan_tree">
    <el-tree ref="nsTree"
            v-if="nsTreeShow"
            node-key="dataId"
            icon-class="el-icon-arrow-right"
            :data="treeData" 
            :props="defaultProps" 
            :highlight-current="true"
            :current-node-key="expandedKey"
            :default-expanded-keys="[expandedKey]"
            @node-click="handleNodeClick"
    ></el-tree>
  </div>
</template>

<script>
// import appService from "@njsdata/app-sdk";
import eventActionDefine from "./components/msgCompConfig";
import { getAssetById } from "./api/asset";
import "./index.css";
export default {
  name: "App",
  props: {
    customConfig: Object,
  },
  data () {
    return {
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      expandedKey: "",
      nsTreeShow: true,
      treeData: [],
      oneData: [],
      twoData: [],
      threeData: [],
      fourData: [],
      fiveData: [],
      selectItem: {}
    }
  },
  computed: {},
  mounted() {
    let { componentId } = this.customConfig || {};
    componentId &&
      window.componentCenter?.register(
        componentId,
        "comp",
        this,
        eventActionDefine
      );
    this.getData(); // 一级
    console.log('customConfig====================>',this.customConfig);
  },
  methods: {
    handleNodeClick(data) {
      if (data.child.length == 0) return
      console.log(data);
      this.expandedKey = data.dataId;
      let {dataId,name,parentId,listId} = data;
      this.selectItem = {dataId,name,parentId,listId};
      let { componentId, appId } = this.customConfig || {};
      componentId &&
      appId &&
      window.eventCenter?.triggerEventNew({
        objectId: appId,
        componentId: componentId,
        type: "app",
        event: "treeNodeClick",
        payload: {
          dataId: this.selectItem.dataId,
          name: this.selectItem.name,
          parentId: this.selectItem.parentId,
          listId: this.selectItem.listId,
        },
      });
    },
    async getData() {
      let that = this;
      let idArray = [
        {
          id: this.customConfig.oneAssetId,
          word: 'oneData',
          key: 'oneListId'
        },
        {
          id: this.customConfig.twoAssetId,
          word: 'twoData',
          key: 'twoListId'
        },
        {
          id: this.customConfig.threeAssetId,
          word: 'threeData',
          key: 'threeListId'
        },
        {
          id: this.customConfig.fourAssetId,
          word: 'fourData',
          key: 'fourListId'
        },
        {
          id: this.customConfig.fiveAssetId,
          word: 'fiveData',
          key: 'fiveListId'
        },
      ]
      for (let i = 0; i < idArray.length; i++) {
        await getAssetById(idArray[i].id).then(res=>{
          let words = idArray[i].word;
          let keys = idArray[i].key;
          let key = res.data[0];
          let value = res.data[1];
          that[words] = value.map(x => {
            let obj = {};
            obj.listId = this.customConfig[keys];
            key.forEach((y,index) =>{
              obj[y.col_name] = x[index]
            })
            return obj;
          });
        }).catch(arr=>{
          console.log(arr);
        });
      }
      this.allData()
    },
    allData() {
      this.fourData.forEach(x=>{
        x.child = [];
        this.fiveData.forEach(y =>{
          y.child = [];
          if (y.parentId == x.dataId) {
            x.child.push(y)
          }
        })
      });
      this.threeData.forEach(x=>{
        x.child = [];
        this.fourData.forEach(y =>{
          if (y.parentId == x.dataId) {
            x.child.push(y)
          }
        })
      });
      this.twoData.forEach(x=>{
        x.child = [];
        this.threeData.forEach(y =>{
          if (y.parentId == x.dataId) {
            x.child.push(y)
          }
        })
      });
      this.oneData.forEach(x=>{
        x.child = [];
        x.parentId = this.customConfig.rootDataId;
        this.twoData.forEach(y =>{
          if (y.parentId == x.dataId) {
            x.child.push(y)
          }
        })
      })
      let root = [{
        dataId: this.customConfig.rootDataId,
        listId: this.customConfig.rootListId,
        name: "南山控股",
        parentId: null,
        child: this.oneData
      }]
      this.treeData = root;
      console.log('treeData',this.treeData);
    },
    do_EventCenter_getId(params) {
      console.log('默认选中',params);
      this.expandedKey = params.id;
      this.nsTreeShow = true;
    },
    Event_Center_getName() {
      return "接收默认选中";
    },
  },
  destroyed() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  },
};
</script>

<style lang="less" scoped>
.nanShan_tree {
  width: 100%;
  height: 100%;

  /deep/ .el-tree-node__content{
    height: 40px;
    color: #000000;

    .el-tree-node__label {
      font-size: 18px;
      font-weight: 500;
    }
  }

  /deep/.el-tree-node.is-current > .el-tree-node__content {
    color: #fff !important;
    background-color: #3354f2 !important;
  }

}
</style>
