<template>
  <div class="custom-node">
    <div class="modleTop">
      <div class="NodeIcon" :style="{
        marginTop: '6px',
        display: icon.html ? 'inline-block' : 'none',
      }" v-html="icon.html" />
      <img class="NodeIcon" :src="getIconUrl" alt="" :style="{
        display: !icon.html ? 'inline-block' : 'none',
      }" />
      <el-input placeholder="动态输入" v-model="nodeName" @input="inputChangeVal"
        :style="{ marginTop: '15px', width: '200px' }" />
      <el-tooltip class="item" effect="dark" content="本节点功能：1.更新插入改造，2.记录日志" placement="right-start">
        <div class="question"><i class="el-icon-info questionTips"></i></div>
      </el-tooltip>
    </div>
    <div class="custom-node-content">
      <div class="content-row">
        <div class="row-left">合并输出模式：</div>
        <div class="row-right">
          <el-select v-model="currentStr" @change="changeCurrent" placeholder="请选择" class="textClass"
            :style="{ width: '200px', marginLeft: '10px' }">
            <el-option :key="index" :label="item.label" :value="item.value" v-for="(item, index) in testsTwo" />
          </el-select>
        </div>
      </div>
      <div class="content-row">
        <div class="row-left">主键字段:</div>
        <div class="row-right">
          <el-select :value="selectCols" @change="changeField" placeholder="请选择" class="textClass" multiple
            collapse-tags :style="{ width: '200px', marginLeft: '10px' }">
            <el-option :key="t.col_index" :label="t.col_name" :value="t.col_name" v-for="t in tests" />
          </el-select>
        </div>
      </div>
      <div class="content-row">
        <div class="row-left">更新/插入字段:</div>
        <div class="row-right">
          <el-select :value="selectColsTwo" @change="changeFieldTwo" placeholder="请选择" class="textClass" multiple
            collapse-tags :style="{ width: '200px', marginLeft: '10px' }">
            <el-option :key="t.col_index" :label="t.col_name" :value="t.col_name" v-for="t in tests" />
          </el-select>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  props: {
    currentNode: String,
    nodeCode: String,
    nodeFieldList: Object,
    nodeInfoList: Object,
    obj_id: String,
    updateNode: Function,
    customIcon: Object,
    img: String,
  },
  mounted() {

  },
  data() {
    let currentNodes = this.currentNode;
    let detail = this.nodeInfoList[currentNodes] || {};
    let currentStr = detail.data.detail.currentStr
    let currentfieldList = this.nodeFieldList[currentNodes] || {};
    let label = detail.label?.split(":")[1];
    let field = detail.data?.detail?.columns || [];
    let field1 = detail.data?.detail?.columns1 || [];
    const tests = currentfieldList[currentNodes] || [];
    const newIcon = this.customIcon || {};
    return {
      nodeName: label,
      fields: field,
      fields1: field1,
      detail,
      currentNodes,
      currentfieldList,
      tests,
      testsTwo: [
        { label: '更新', value: '更新' },
        { label: '更新并插入', value: '更新并插入' },
      ],
      selectColsTwo: field1.map(_ => _.col_name),
      selectCols: field.map(_ => _.col_name),
      currentStr: currentStr,
      icon: newIcon,
    };
  },

  methods: {
    updateNode1(newName, newFields) {
      let detail = this.detail;
      detail.data = detail.data || {};
      detail.data.detail = detail.data.detail || {};
      detail.data.text = {
        internalName: newName,
        code: this.currentNodes,
      };
      detail.data.detail.columns = newFields;
      detail.label = this.currentNodes + ":" + newName;
      console.log('details=-==', detail);
      this.updateNode(detail);
    },
    updateNode3(newName,newFields) {
      let detail = this.detail;
      detail.data = detail.data || {};
      detail.data.detail = detail.data.detail || {};
      detail.data.text = {
        internalName: newName,
        code: this.currentNodes,
      };
      detail.data.detail.columns1 = JSON.parse(JSON.stringify(newFields));
      detail.label = this.currentNodes + ":" + newName;
      console.log('details=-==', detail);
      this.updateNode(detail);

    },
    updateNode2(newName, newFields) {
      let detail = this.detail;
      detail.data = detail.data || {};
      detail.data.detail = detail.data.detail || {};
      detail.data.text = {
        internalName: newName,
        code: this.currentNodes,
      };
      detail.data.detail.currentStr = newFields;
      detail.label = this.currentNodes + ":" + newName;
      console.log('detail==', detail);
      this.updateNode(detail);
    },
    inputChangeVal(value) {
      this.nodeName = value;
      this.updateNode1(value, this.fields);
    },
    changeCurrent(value) {
      this.updateNode2(this.nodeName, this.currentStr)
    },
    changeField(fieldOpt) {
      let ele = this.tests.filter(test => fieldOpt.includes(test.col_name));
      this.selectCols = fieldOpt;
      this.fields = ele;
      this.updateNode1(this.nodeName, ele);
    },
    changeFieldTwo(fieldOpt) {
      let ele = this.tests.filter(test => fieldOpt.includes(test.col_name));
      this.selectColsTwo = fieldOpt
      this.fields1 = ele
      this.updateNode3(this.nodeName, ele);

    }
  },
  computed: {
    getIconUrl() {
      return `${window.location.origin}/storage_area/ext_plugins/web/${this.obj_id}/images/${this.img}`;
    },
  },
};
</script>
<style lang="less" scoped>
.custom-node {
  height: 100%;
  width: 100%;
  background-color: white;

  .modleTop {
    display: flex;

    .NodeIcon {
      color: #9e9e9e;
      margin-left: 18px;
      margin-top: 15px;
      width: 36px;
      height: 36px;
      margin-right: 10px;
    }

    .question {
      color: #9e9e9e;
      margin-left: 18px;
      margin-top: 15px;
      width: 36px;
      height: 36px;
      margin-right: 10px;
      line-height: 36px;

      .questionTips {
        color: orange;
      }

    }
  }

  .custom-node-content {
    height: 240px;
    padding: 20px 40px;

    .content-row {
      height: 48px;
      display: flex;
      align-items: center;

      .row-left {
        width: 120px;
        text-align: left;
      }

      .row-right {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
