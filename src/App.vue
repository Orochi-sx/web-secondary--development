<template>
  <div @click="tempFn" class="River">



    <ul class="item">
      <li v-for="(item, index) in listData" :key="index" :i="index" class="sjjd">
        <div class="ident">{{ index + 1 }}</div>
        <div :class="{ lx_type: true, qt_type: item.sjlx == '群体' }"> [{{ item.sjlx }} {{ item.sjbq }}]
        </div>
        <div class="title" :style="{ color: fontColor }">{{ item.sjnr }}</div>
        <div class="sj_num" :style="{ color: fontColor }">{{ item.sj_num }}件</div>
      </li>
    </ul>


    <Dlog :dialogVisible="show" :Assetid="Assetid" :gt="fl" :sj="sj" @close="show = false" @tabk="tabkFn"></Dlog>
    <el-dialog title="" :visible.sync="dialogTableVisible" width="800px">
      <iframe style="height: 800px;width: 100%" src="" ref="bigscreeniframe"></iframe>
    </el-dialog>
  </div>


</template>

<script>
const zipObject = (arr1, arr2) => {
  const ret = {};
  arr1.forEach((item, index) => {
    ret[item] = arr2[index];
  });
  return ret;
};
import Dlog from './dialog.vue'
import axios from './api/asset'
export default {
  components: {
    Dlog
  },
  props: {
    dataSource: {
      type: Array,
      default: () => [],
    },
    componentId: {
      type: String | undefined,
      default: "",
    },
    options: {
      type: Object,
      default: () => ({
        // 配置项从externalVariables里取
        externalVariables: {},
      }),
    },
    updateProcess: {
      type: Function,
      default: () => { },
    },
  },
  data() {
    return {
      fl: '',
      dialogTableVisible: false,
      sj: {},
      show: false,
      listData: [
      ],
      tmep: []
    }
  },
  computed: {
    tableDataHeader() {
      return (this.dataSource[0] || []).map(t => ({
        prop: t,
        label: t,
      }));
    },
    tableData() {
      let [header, ...tableData] = this.dataSource;
      tableData = tableData || [];
      return tableData.map(d => zipObject(header, d));
    },

    Assetid() {
      return {
        rqid: (this.options && this.options.externalVariables && this.options.externalVariables.riqiAssetid) || '0a445748-3995-4fff-9035-65d3fc707c83',
        ryid: (this.options && this.options.externalVariables && this.options.externalVariables.renyunAssetid) || 'a7cdbd73-35f9-4d03-9d5e-7585eaa64760',
        sjryid: (this.options && this.options.externalVariables && this.options.externalVariables.sjryAssetid) || '52936235-3d1b-400f-9674-3d948204eb1d',
        sjztid: (this.options && this.options.externalVariables && this.options.externalVariables.sjztAssetid) || '4009cd7e-0ed3-4715-a08b-ffe222678c09',
        sjdjid: (this.options && this.options.externalVariables && this.options.externalVariables.sjdjAssetid) || 'aec40cbb-574e-4db5-b754-22b265a2ecf5',
        sjldid: (this.options && this.options.externalVariables && this.options.externalVariables.sjldAssetid) || 'cef9f08d-d3f7-4b9c-a3fd-bda34a09a7a4',
      }
    },
    fontColor() {
      return this.options.externalVariables.fontColor ? this.options.externalVariables.fontColor : 'black'
    }
  },
  created() {
    // this.listData = this.tableData
    axios.queryAssetById('5056ec11-a1ac-4230-861f-64cf588c3c56', []).then(res => {
      this.listData = this.translatePlatformDataToJsonArray(res)
      //   // this.translatePlatformDataToJsonArray(res).forEach(x => {
      //   //   this.listData.push(x)
    })
    // })
    // console.log(this.listData, '==================');


  },
  mounted() {
    window._eventjd = this
  },
  methods: {
    tabkFn(row) {
      let name = row.subjectName;
      this.dialogTableVisible = true
      this.$refs.bigscreeniframe.src = `bigscreenv3/viewer/8d529a2c-a0c9-4d30-a218-b53c206a5ddc?name=${name}`
    },
    tempFn(e) {
      let target = e.target
      if (target.tagName == 'LI' || target.parentNode.tagName == 'LI') {
        let temp = target.tagName == 'LI' ? target : (target.parentNode.tagName == 'LI' ? target.parentNode : null)
        const i = temp.getAttribute('i')
        this.sj = this.listData[i]
        this.sj.sjgl = 0
        this.sj.sjqt = 0
        this.show = true
      }
    },
    translatePlatformDataToJsonArray(originTableData) {
      console.log(originTableData, '==================handler');
      let originTableHeader = originTableData[0];
      let tableHeader = [];
      originTableHeader.forEach((item) => {
        tableHeader.push(item.col_name);
      });
      let tableBody = originTableData[1];
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

    // clickBt() {
    //   this.componentId &&
    //     window.eventCenter?.triggerEvent &&
    //     window.eventCenter.triggerEvent(this.componentId, "onClick", {
    //       name: "二开插件",
    //     });
    // },
    // 逻辑控制用，不可删，return内容可改
    Event_Center_getName: () => {
      return "武汉群个体事件";
    },
    do_EventCenter_messageSuccess(param) {
      alert("动作执行成功！");
    },
  },
};
</script>
<style lang="less" scoped>
.River {
  height: 100%;
  width: 100%;
}

/deep/ .el-dialog {
  background: #103260;
  margin: 5vh auto 50px !important;
  z-index: 2500;
  width: 1300px !important;
}

.sjjd {
  display: flex;
  margin-left: 10px;
  margin-bottom: 10px;

  div {
    margin-right: 10px;
  }

  .ident {
    background: #4286fb;
    color: white;
    width: 30px;
    height: 20px;
    text-align: center;
    border-radius: 8px 0 8px 0;
  }

  .lx_type {
    // background: rgba(63, 129, 244, .3) url('./img/geren.png') no-repeat 0 50%;
    // background-size: 14px;
    color: #4084f7;
    // border: 1px solid rgb(66, 134, 251);
    border-radius: 3px;
    font-size: 14px;
    box-sizing: border-box;
    padding-left: 14px;
    width: 70px;
  }

  .qt_type {
    color: #63d9f1;
    // border: 1px solid #63d9f1;
    // background: rgba(107, 231, 255, .3) url('./img/qunz.png') no-repeat 0 50%;
    // background-size: 14px;
  }

  .title {
    width: calc(100% - 180px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

  }
}
</style>
