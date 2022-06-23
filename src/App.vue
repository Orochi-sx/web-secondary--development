<template>
  <div class="thingss">
    <div class="header">
      事件相关人
    </div>
    <div class="titleHeader">
      <div style="flex:2">序号</div>
      <div style="flex:2">姓名</div>

      <div style="flex:2">性别</div>
      <div style="flex:4">手机号</div>
      <div style="flex:3">事件数</div>
      <div style="flex:3">人群分类</div>
    </div>
    <div class="table" @click="rowClick">
      <vue-seamless-scroll :data="tableData" class="seamless-warp">
        <div v-for="(item, index) in tableData" :key="index" class="sitem" :i="index">
          <div style="flex:2">{{ index + 1 }}</div>
          <div style="flex:2">{{ item.xm }}</div>
          <div style="flex:2">{{ item.xb }}</div>
          <div style="flex:4">{{ item.yddh }}</div>
          <div style="flex:3">{{ item['事件数'] }}</div>
          <div style="flex:3;color: orange;">{{ item['人群分类'] || '/' }}</div>

        </div>
      </vue-seamless-scroll>
    </div>
    <el-dialog title="人员详情" :visible.sync="dialogVisible" :append-to-body="true" width="70%" :before-close="handleClose"
      @open="open">
      <div class="dioBox_title">
        基础信息
      </div>
      <div class="dioBox_body">
        <div class="dioBox_body_personInfo comm">
          <div class="comm_box">
            <div class="headImg bgComm">
            </div>
            <div class="nameBox nameComm">
              姓名：
            </div>
            <div class="nameValue nameVComm">
              {{ this.infoObject['xm'] }}
            </div>
          </div>
          <div class="comm_box">
            <div class="sexImg bgComm">
            </div>
            <div class="nameBox nameComm">
              性别：
            </div>
            <div class="nameValue nameVComm">
              {{ this.infoObject['xb'] }}
            </div>
          </div>
          <div class="comm_box">
            <div class="phoneBox bgComm">
            </div>
            <div class="nameBox nameComm">
              手机号：
            </div>
            <div class="nameValue nameVComm">
              {{ this.infoObject['yddh'] }}
            </div>
          </div>
          <div class="comm_box">
            <div class="cardBox bgComm">
            </div>
            <div class="nameBox nameComm">
              身份证号：
            </div>
            <div class="nameValue nameVComm">
              {{ this.infoObject['sfzh'] }}
            </div>
          </div>
          <div class="comm_box">
            <div class="addressImg bgComm">
            </div>
            <div class="nameBox nameComm">
              住址：
            </div>
            <div class="nameValue nameVComm">
              {{ this.infoObject['zz'] }}
            </div>
          </div>
        </div>
        <div class="thingsEcharts comm">
          <div class="eChartsBox" ref="myEcharts">
          </div>
        </div>
      </div>
      <div class="thinsList_titleBox dioBox_title">
        涉及事件列表

      </div>
      <!-- 筛选功能 -->
      <!-- <div v-if="dialogVisible">
        <el-select v-model="value" placeholder="请选择" @change="selectChange">
          <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div> -->


      <div class="dioTableBox" v-if="dialogVisible">
        <el-table :data="dioTableDate" border style="width: 100%">
          <el-table-column prop="序号" label="序号" min-width="5%">
          </el-table-column>
          <el-table-column prop="事件类型" label="事件类型" min-width="10%">
          </el-table-column>
          <el-table-column prop="上报时间" label="上报时间" min-width="15%">
          </el-table-column>
          <el-table-column prop="事件内容" label="事件内容" min-width="70%">
          </el-table-column>
        </el-table>
        <div style="position: absolute;bottom: 0;right: 0;">
          <el-pagination @current-change="handleCurrentChange" :current-page="currentPage4" :page-size="4"
            layout="prev, pager, next, jumper" :total="totalLength">
          </el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import vueSeamlessScroll from 'vue-seamless-scroll'
import * as echarts from 'echarts'
import { queryAssetById } from './api/asset';

export default {
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
  components: {
    vueSeamlessScroll
  },
  data() {
    return {
      currentPage4: 1,
      dialogVisible: false,
      echartsAssId: '',
      dioTableAssId: '',
      mapValue: '',
      tableMapValue: '',
      dioTabTitleList: [],
      mapIndex: '',
      allInfo: [],
      TabMapIndex: '',
      echartsInfo: [],
      flagList: [],
      xDate: [],
      yDate: [],
      yNumList: [],
      tableData: [],
      infoObject: {},
      dioTableDate: [],
      selectOptions: [],
      value: '',
      filterStr: '',
      totalLength: 0

    };
  },
  computed: {

  },
  mounted() {
    this.echartsAssId = this.options?.externalVariables?.echartsAssId || '3d07168a-1d0a-4e15-a0b0-63fd26d1c8ee'
    this.mapValue = this.options?.externalVariables?.mapValue || 'sjid'
    this.dioTableAssId = this.options?.externalVariables?.dioTableAssId || '2c491a44-d835-4794-9224-5b4d7f48d3b6'
    this.tableMapValue = this.options?.externalVariables?.tableMapValue || 'sjid'
    this.filterStr = this.options?.externalVariables?.filterStr || '事件人员'
    this.getInfo()
    this.getEchatsInfo()
    this.getDioTableInfo()
    const events = [
      {
        key: "onClick",
        name: "点击",
        payload: [
          {
            name: "名称",
            dataType: "string",
            key: "name",
          },
        ],
      },
    ];

    const actions = [

    ];

    this.componentId &&
      window.componentCenter?.register &&
      window.componentCenter.register(this.componentId, "comp", this, {
        events,
        actions,
      });
    this.updateProcess && this.updateProcess();
  },
  methods: {
    getInfo() {
      let lsArr = []
      let titleHeader = []
      titleHeader = this.dataSource[0]
      let dataSourceArr = []
      dataSourceArr = this.dataSource.filter((item, index) => {
        return index !== 0
      })
      dataSourceArr.forEach((item, index) => {
        let temp = {}
        item.forEach((d, i) => {
          temp[titleHeader[i]] = d

        })
        lsArr.push(temp)
      })
      this.tableData = lsArr
    },
    async getEchatsInfo() {
      await queryAssetById(this.echartsAssId).then(res => {
        res.data[0].forEach((item, index) => {
          if (index !== 0) {
            this.xDate.push(item.col_name)
          }
          if (item.col_name === this.mapValue) {
            this.mapIndex = index
          }
        })
        this.echartsInfo = res.data[1]
        this.flagList = res.data[1]
      })
    },
    async getDioTableInfo() {
      await queryAssetById(this.dioTableAssId).then(res => {
        res.data[0].forEach(item => {
          this.dioTabTitleList.push(item.col_name)
        })
        this.ysTabList = res.data[1]
        res.data[0].forEach((item, index) => {
          if (item.col_name === this.tableMapValue) {
            this.TabMapIndex = index
          }
        })
      })
    },
    selectChange(val) {
      this.dioTableDate = this.allInfo.filter(item => {
        return item[this.filterStr] === val
      })
      this.totalLength = this.dioTableDate.length
      if (this.dioTableDate.length > 4) {
        this.dioTableDate = this.dioTableDate.slice(0, 4)

      }
    },
    handleCurrentChange(val) {
      this.dioTableDate = this.allInfo.slice((val - 1) * 4, val * 4)

    },
    cellStyle() {
      let styleObj = {}
      styleObj.border = 'none'
      return styleObj

    },
    rowStyle() {
      let styleObj = {}
      styleObj.border = 'none'
      return styleObj

    },
    open() {
      this.$nextTick(() => {
        this.eChartsInit()

      })
    },
    //去重方法
    ridding(tempArr, str) {
      let map = new Map()
      let arr = []
      for (let item of tempArr) {
        if (!map.has(item[str])) {
          map.set(item[str], item)
        }
      }
      arr = [...map.values()]
      return arr
    },
    eChartsInit() {
      var chartDom = this.$refs.myEcharts
      var myCharts = echarts.init(chartDom)
      var option
      option = {
        xAxis: {
          boundaryGap: true,
          type: 'category',
          data: this.xDate,
          axisLine: {
            // alignWithLabel: true,
            lineStyle: {
              color: '#ffffff'
            }

          },
          position: 'bottom',
          axisTick: {
            show: true,
            inside: true
          },

        },
        tooltip: {
          trigger: 'item',

        },
        legend: {
          show: true,
          textStyle: {
            color: "#ffffff"
          }



        },
        yAxis: {
          type: 'value',
          axisLine: {
            // alignWithLabel: true,
            lineStyle: {
              color: '#ffffff'
            }

          },
        },
        series: [
          {
            name: '事件数量',
            data: this.yNumList,
            type: 'line',
            lineStyle: {
              color: '#3F7AD3'
            }
          }
        ]
      };
      option && myCharts.setOption(option);
      window.addEventListener('resize', () => {
        myCharts.resize()
      })


    },
    handleClose(done) {
      this.dialogVisible = false

    },
    rowClick(e) {
      let attubuti = e.target.parentNode.getAttribute('i')
      let symbolObj = this.tableData[attubuti]


      this.allInfo = []
      this.$nextTick(() => {
        this.currentPage4 = 1
      })

      this.infoObject = symbolObj
      let yDate = []
      yDate = this.echartsInfo.filter(item => {
        return item[this.mapIndex] == symbolObj[this.mapValue]
      })
      let newArr = Object.assign([], yDate[0])

      newArr.splice(this.mapIndex, 1)
      this.yNumList = newArr
      let filter = []
      filter = this.ysTabList.filter((item, index) => {
        return item[this.TabMapIndex] == symbolObj[this.tableMapValue]
      })
      filter.forEach((item, index) => {
        let tempObj = {}
        item.forEach((d, i) => {
          tempObj[this.dioTabTitleList[i]] = d

        })
        this.allInfo.push(tempObj)
        this.totalLength = this.allInfo.length
      })
      this.dioTableDate = this.allInfo.slice(0, 4)
      console.log('dioTableDate==', this.dioTableDate);
      let riddingArr = this.ridding(this.allInfo, this.filterStr)
      riddingArr.forEach(item => {
        this.selectOptions.push({
          value: item[this.filterStr],
          label: item[this.filterStr],
        })
      })
      this.dialogVisible = true
    },
    dioTableHead() {
      return 'background:rgba(0,0,0);color:#ffffff'

    },
    rowClass() {
      return 'background:rgba(4,38,83,0.8);color:#ffffff;opcity:0.7;'

    },
    // 逻辑控制用，不可删，return内容可改
    Event_Center_getName: () => {
      return "事件相关人";
    },
  },

};

</script>
<style scoped lang="less">
* {
  box-sizing: border-box;
  border: none;
}

.sitem {
  width: 100%;
  display: flex;
  height: 50px;
  line-height: 50px;
  padding-left: 20px;
  // background: rgba(0,20,47,0.5);
  overflow: hidden;
}

.seamless-warp {
  height: calc(100% - 70px);
  overflow: hidden;
}

.titleHeader {
  display: flex;
  width: 100%;
  height: 50px;
  background-color: rgba(5, 39, 84, 0.8);
  margin-top: 20px;
  line-height: 50px;
  color: #ffffff;
  padding-left: 20px;
}

.thingss {
  height: 100%;
  overflow: hidden;


  .header {
    width: 100%;
    height: 50px;
    background-image: linear-gradient(to left, #184886, #184886 0%);
    // background-color: #184886;
    padding-left: 10px;
    line-height: 50px;
    color: #ffffff;
    font-weight: 500;
    font-size: 15px;

  }

  .table {
    width: 100%;
    // height: 100%;
    // overflow: hidden;
    // height: calc(100% - 70px);
    margin-top: 20px;
    // overflow-y: hidden;
  }
}


// /deep/.el-dialog__header {
//   background: linear-gradient(to right, #0C4396, #113B70) !important;
//   color: #ffffff !important;
//   padding: 10px !important;

// }

/deep/.el-dialog__title {
  color: #ffffff !important;

}

/deep/.el-dialog__headerbtn {
  top: 13px;
  right: 10px;

}

.dioBox {
  background: #10305F;
  width: 100%;
  height: 100%;
}

/deep/.el-dialog__body {
  background: #10305F !important;
  padding: 10px 20px !important;

}

.dioBox_title {
  width: 100%;
  height: 40px;
  background-image: url(../asset/line.png);
  background-size: 100% 100%;
  line-height: 40px;
  padding-left: 25px;
  font-size: 17px;
  font-weight: 700;
  color: #ffffff;

}

.dioBox_body {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.comm {
  width: 49%;
  // height: 300px;
  background-image: url(../asset/box1.png);
  background-size: 100% 100%;
  padding: 5px;

  .comm_box {
    height: 60px;
    border: 2px solid rgba(204, 204, 204, 0.1);
    margin: 5px 0;
    line-height: 60px;
    display: flex;
    // flex-direction:column;
    // justify-content: center;
    padding-left: 10px;
    align-items: center;

  }
}

.headImg {
  width: 20px;
  height: 20px;
  background-image: url(../asset/header.png);
  background-size: 100% 100%;
}

.nameComm {
  color: #3D7FA4;
  font-size: 15px;
  font-weight: bold;
  margin-left: 10px;

}

.nameVComm {
  color: #ffffff;
  font-size: 15px;
  // font-weight: bold;
  margin-left: 10px;
}

.cardBox {

  background-image: url(../asset/个体/card.png);


}

.phoneBox {

  background-image: url(../asset/phone.png);


}

.sexImg {

  background-image: url(../asset/sex.png);


}

.addressImg {

  background-image: url(../asset/address1.png);


}

.bgComm {
  width: 20px;
  height: 20px;
  background-size: 100% 100%;

}

.eChartsBox {
  width: 100%;
  height: 100%;
}

.thinsList_titleBox {
  margin-top: 20px;

}

.dioTableBox {
  width: 100%;
  height: 290px;
  // overflow-y: auto;
  background-image: url(../asset/box1.png);
  background-size: 100% 100%;
  padding: 5px;
  margin-top: 10px;
  position: relative;

}

/deep/.el-table__row {
  border-bottom: 0px solid #EBEEF5 !important;

}

.el-table::before {
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0px;
}

/deep/.dioTableBox .is-leaf {
  color: #ffffff !important;
  background-color: #11427C;
}

/deep/.dioTableBox .el-table__row {
  background-color: #143A67;
  color: #ffffff;

}

/deep/.el-table--enable-row-hover .el-table__body tr:hover>td {
  background-color: rgba(0, 0, 0, 0) !important;
}

/deep/.el-input__inner {
  background: #10305F !important;
  border: none !important;
}

/deep/ .el-dialog__header {
  background: #0D4399;
  padding: 10px;
}

/deep/.el-pagination .btn-prev {
  background: #143A67 !important;
  color: #ffffff;
}

/deep/ .el-pagination .btn-next {
  background: #143A67 !important;
  color: #ffffff;
  // opacity: 0.5;
}

/deep/ .el-pager li {
  background: #143A67 !important;
  color: #ffffff;


}

/deep/ .el-pager li.active {
  color: skyblue !important;
  cursor: default;
}

/deep/.el-pagination__jump {
  color: #ffffff;
}

/deep/.el-pagination__jump .el-input__inner {
  color: #ffffff !important;
}
</style>
