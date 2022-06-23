<template>
  <div @click="tempFn" class="River">



    <ul class="item">
      <li v-for="(item, index) in listData" :key="index" :i="index" class="sjjd">
        <div class="ident">{{ index + 1 }}</div>
        <div :class="{ lx_type: true, qt_type: item.sjlx == '群体' }"> {{ item.sjlx }}
        </div>
        <div class="title" :style="{ color: fontColor }">{{ item.sjnr }}</div>
        <div class="sj_num" :style="{ color: fontColor }">{{ item.sj_num }}件</div>
      </li>
    </ul>


    <Dlog :dialogVisible="show" :Assetid="Assetid" :gt="fl" :sj="sj" @close="show = false"></Dlog>
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
      return { rqid: (this.options && this.options.externalVariables && this.options.externalVariables.riqiAssetid) || '4113f95d-32d7-42d6-8a19-46fa4b5388a0', ryid: (this.options && this.options.externalVariables && this.options.externalVariables.renyunAssetid) || '6094c1bc-230e-486f-baad-6583dbac7fd5' }
    },
    fontColor() {
      return this.options.externalVariables.fontColor ? this.options.externalVariables.fontColor : 'black'
    }
  },
  created() {
    this.listData = this.tableData
    // axios.queryAssetById('3020211c-1f0e-407e-a432-5ab9b2c789cd', []).then(res => {
    //   this.listData = this.translatePlatformDataToJsonArray(res)
    //   // this.translatePlatformDataToJsonArray(res).forEach(x => {
    //   //   this.listData.push(x)
    //   // })
    // })
    // console.log(this.listData, '==================');


  },
  methods: {
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
    text-align: center;
    border-radius: 8px 0 8px 0;
  }

  .lx_type {
    background: rgba(63, 129, 244, .3) url('./img/geren.png') no-repeat 0 50%;
    background-size: 14px;
    color: #4084f7;
    border: 1px solid rgb(66, 134, 251);
    border-radius: 3px;
    font-size: 14px;
    box-sizing: border-box;
    padding-left: 14px;
    width: 45px;
  }

  .qt_type {
    color: #63d9f1;
    border: 1px solid #63d9f1;
    background: rgba(107, 231, 255, .3) url('./img/qunz.png') no-repeat 0 50%;
    background-size: 14px;
  }

  .title {
    width: calc(100% - 150px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

  }
}
</style>
