<template>
  <div class="tree">
    <!-- 树形控件 -->
    <el-card class="tree_left">
      <div class="button_group">
        <div class="tree_button">
          <el-button icon="el-icon-plus" size="mini" :disabled="addDisabledButton" @click="append">新增</el-button>
          <el-button icon="el-icon-edit" size="mini" :disabled="disabledButton" @click="edit">编辑</el-button>
          <el-button icon="el-icon-delete" size="mini" :disabled="disabledButton" @click="remove">删除</el-button>
        </div>
      </div>
      <div>
        <el-tree ref="tree" :data="treeList" @node-click="handleNodeClick" :props="defaultProps"
          :expand-on-click-node="false" default-expand-all>
        </el-tree>
      </div>
    </el-card>
    <!-- 表格组件 -->
    <el-card class="tree_right">
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column prop="sample" label="样品位置"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
// import appService from "@njsdata/app-sdk";
import eventActionDefine from "./components/msgCompConfig";
import "./index.css";
import { queryAssetById, createTbSample, updateTbSample, deleteTbSample } from './api/asset'

export default {
  name: "App",


  props: {
    customConfig: Object,
    info: Object,
  },

  data() {
    return {
      // 树控件默认格式
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      //节点层级
      nodeLevelName: [],
      // 按钮禁用
      disabledButton: true,
      // 新增按钮禁用
      addDisabledButton: true,
      // 选中数据
      treeData: {},
      // 选中节点
      treeNode: {},
      // 树控件数据列表
      treeList: [],
      // 表格数据
      tableData: [],
      // 表格行数据
      labelList: [],
    };
  },
  mounted() {
    let { componentId } = this.customConfig || {};
    componentId &&
      window.componentCenter?.register(
        componentId,
        "comp",
        this,
        eventActionDefine
      );

    // this.customConfig.assetId = 'f6515bb2-8c25-9702-dcc7-c000a54ff8e3'
    this.getTreeData()
  },

  methods: {
    // 请求资产并处理数据格式, 渲染页面
    getTreeData() {
      let { assetId } = this.customConfig

      queryAssetById({ assetId: assetId }).then((res) => {
        const nest = (items, id = '') => items.filter(item => item['parentId'] == id).map(item => ({ ...item, children: nest(items, item.id) }));

        this.treeList = nest(res.data)
        this.$nextTick(() => {
          this.labelList = [];
          this.createTableData(this.treeList);
          this.refreshTableData();
        });
      })
    },

    // 数据转换
    translatePlatformDataToJsonArray(originTableData) {
      let originTableHeader = originTableData.data[0];
      let tableHeader = [];
      originTableHeader.forEach((item) => {
        tableHeader.push(item.col_name);
      });
      let tableBody = originTableData.data[1];
      let tableData = [];
      tableBody.forEach((tableItem) => {
        let temp = {};
        tableItem.forEach((item, index) => {
          temp[tableHeader[index]] = item;
        });
        tableData.push(temp);
      });
      return tableData;
    },

    // 节点选中
    handleNodeClick(data, node) {
      this.treeData = data;
      this.treeNode = node;

      this.addDisabledButton = false;

      data.name != "样品位置" ? this.disabledButton = false : this.disabledButton = true;
    },

    // 创建表格数据
    createTableData(arr, temp = "") {
      if (arr.length) arr = arr[0];

      arr.children.forEach((e) => {
        temp += `${e.name}-`;
        if (e.children.length) {
          this.createTableData(e, temp);
          temp = temp.substring(0, temp.length - (e.name.length + 1));
        } else {
          this.labelList.push(temp);
          temp = temp.substring(0, temp.length - (e.name.length + 1));
        }
      });
    },

    // 刷新表格数据
    refreshTableData() {
      this.tableData = [];
      this.labelList.forEach((item) => {
        this.tableData.push({
          sample: item.slice(0, -1),
        });
      });
    },

    //获取父节点

    obtainNodeName(node) {


      if (Boolean(node.parent) && node.parent.data.name != '样品位置') {

        this.nodeLevelName.push(node.parent.data.name)
        this.obtainNodeName(node.parent)
      } else {

        return
      }

    },




    // 新增节点
    append() {
      this.$prompt("请输入节点名称", "新增", { confirmButtonText: "确定", cancelButtonText: "取消", }).then((e) => {
        let { assetId } = this.customConfig
        let dataForm = {
          assetId: assetId,
          name: e.value || "节点",
          parentId: this.treeData.id,
          tierName: this.treeData.tierName,
        }
        this.obtainNodeName(this.treeNode)

        // console.log(this.nodeLevelName.reverse().join('-'), '==================nodeLevelName');

        dataForm.tier = this.nodeLevelName.reverse().join('-') + '-' + this.treeData.name + '-' + dataForm.name
        this.nodeLevelName = []
        // let tierList = []
        // this.tableData.forEach((e) => {
        //   if (e.sample.indexOf(this.treeData.name) != -1) {
        //     tierList.push(e.sample + `-${dataForm.name}`)
        //   }
        // })
        // dataForm.tier = tierList


        // this.treeData.children.push(dataForm)
        // console.log(this.treeNode, '========treeNode')
        // console.log(this.tableData, '========tableData')
        // console.log(dataForm, '========新建节点')

        createTbSample(dataForm).then((res) => {
          this.getTreeData()
        })
      }).catch(() => { });
    },

    // 修改节点
    edit() {
      this.$prompt("请输入节点名称", "编辑", { confirmButtonText: "确定", cancelButtonText: "取消", inputValue: this.treeData.name, }).then((e) => {
        let { assetId } = this.customConfig

        let dataForm = {
          assetId: assetId,
          name: e.value || "节点",
          id: this.treeData.id,
        }
        this.obtainNodeName(this.treeNode)

        dataForm.tier = this.nodeLevelName.reverse().join('-') + '-' + dataForm.name
        this.nodeLevelName = []
        // console.log(this.nodeLevelName.reverse().join('-'), e.value, '=========');
        // let tierList = []
        // this.tableData.forEach( (e) => {
        //   if(e.sample.indexOf(this.treeData.name) != -1) {
        //     tierList.push(e.sample)
        //   }
        // })
        // dataForm.tier = tierList

        updateTbSample(dataForm).then((res) => {
          this.getTreeData()
        })

      }).catch(() => { });
    },

    // 删除节点
    remove() {
      this.$confirm("此操作将永久删除该节点, 是否继续?", "删除", { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning", }).then(() => {
        let { assetId } = this.customConfig
        let dataForm = {
          assetId: assetId,
          id: this.treeData.id,
        }

        deleteTbSample(dataForm).then((res) => {
          this.getTreeData()
        })

      }).catch(() => { });
    },

    Event_Center_getName() {
      return "树形控件";
    },
  },

  destroyed() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  },
};
</script>

<style lang="less">
.tree {
  width: 100%;
  display: flex;
}

.tree_left,
.tree_right {
  width: 50%;
}

.tree_right {
  width: 49%;
  margin-left: 1%;
}

.button_group {
  display: flex;
}

.tree_button {
  width: 100%;
  text-align: right;
  margin-bottom: 20px;
}

.el-tree-node__content {
  background: #f4f4f5;
  border-radius: 4px;
  height: 35px;
  line-height: 35px;
  margin-bottom: 15px;
  border: 1px solid #f4f4f5;
}

// 选中节点效果
.el-tree-node.is-current>.el-tree-node__content {
  border: 1px solid #409eff;
}

// 图标旋转
.el-tree .el-tree-node__expand-icon.expanded {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}

// 树形子节点未展开
.el-tree .el-icon-caret-right:before {
  content: "+";
  display: block;
  width: 13px;
  height: 13px;
  font-size: 13px;
  color: #409eff;
  border: 1px solid #409eff;
  text-align: center;
  border-radius: 4px;
}

// 树形子节点展开
.el-tree .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
  content: "-";
  display: block;
  width: 13px;
  height: 13px;
  font-size: 14px;
  color: #409eff;
  border: 1px solid #409eff;
  text-align: center;
  border-radius: 4px;
}

// 树形子节点最后一级
.el-tree-node__expand-icon.is-leaf::before {
  content: "";
  display: block;
  width: 12px;
  height: 12px;
  border: 1px solid #409eff;
  text-align: center;
  border-radius: 50%;
}

.has-gutter th:first-child {
  padding-top: 0;
}
</style>
