<template>
  <div class="infoCard" ref="fullscreen">
    <div class="production_top">
      <div class="productiont_button">
        <el-button class="production_export" type="primary" @click="goBackFn">返回</el-button>
        <el-button class="production_full" type="primary" @click="fullscreenHandle(fullStatus)">
          {{ !fullStatus ? '全屏打开' : '退出全屏' }} </el-button>
        <el-button class="production_export" type="primary" @click="exeportFn">Excel导出</el-button>
      </div>
      <div class="productiont_screen" v-if="!fullStatus">
        <div class="productiont_orderid  productiont_public">
          <div class="orderid_title ">订单编号：</div>
          <el-input type="text" v-model="orderid" />
        </div>
        <div class="productiont_partsid productiont_public">
          <div class="orderid_title">零件代号：</div>
          <el-input type="text" v-model="partsid" />
        </div>
        <div class="productiont_partsid productiont_public">
          <div class="orderid_title">作业订单编号：</div>
          <el-input type="text" v-model="inscode" />
        </div>
        <div class="productiont_finisheddate productiont_public">
          <div class="orderid_title">计划完工日期：</div>
          <el-date-picker v-model="value1" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="productiont_finisheddate productiont_public">
          <el-button class="production_export" type="primary" @click="queryAll">查询</el-button>
        </div>
        <div class="productiont_finisheddate productiont_public">
          <el-button class="production_export" type="primary" @click="restFn">重置</el-button>
        </div>
      </div>
    </div>
    <div class="production_table">
      <h1 class="prodtable_title">生产执行进度表</h1>
      <div class="prodtble_body">
        <el-table :data="tableData" ref="elTable" style="width: 100%" id="exportTab" border
          :header-cell-style="{ fontSize: '16px', color: '#333' }">
          <el-table-column type="index" label="序号" header-align="center" align="center" fixed>
          </el-table-column>
          <el-table-column prop="ordPrograme" label="策划号" width="300" header-align="center" align="center" fixed>

          </el-table-column>
          <el-table-column prop="ordCode" label="订单编号" width="180" header-align="center" align="center" fixed>
          </el-table-column>
          <el-table-column prop="insCode" label="作业订单编号" width="180" header-align="center" align="center" fixed>
          </el-table-column>
          <el-table-column prop="reqTime" label="需求时间" width="120" header-align="center" align="center" fixed>
          </el-table-column>
          <el-table-column prop="compCode" label="零件代号" width="100" header-align="center" align="center" fixed>
          </el-table-column>
          <el-table-column prop="compName" label="零件名称" header-align="center" align="center" fixed>
          </el-table-column>
          <el-table-column prop="compNum" label="零件数量" header-align="center" align="center" fixed>
          </el-table-column>
          <el-table-column prop="planOrdEndtime" label="计划完工时间" width="120" header-align="center" align="center" fixed>
          </el-table-column>
          <el-table-column prop="status" label="执行状态" header-align="center" align="center" fixed>
            <template slot-scope="scope">
              <div v-if="scope.row.status"
                :style="{ backgroundColor: scope.row.status == '正常' ? 'green' : 'red', width: '24px', height: '24px', borderRadius: '50%', margin: 'auto' }">
              </div>
            </template>
            <!-- <template slot-scope="scope">
              <div :style="{ color: scope.row.status == '正常' ? 'green' : 'red', }">
                {{
                    scope.row.status
                
                }}</div>
            </template> -->
          </el-table-column>

          <el-table-column prop="detail" label="工序路线" class-name="prd_address" header-align="center" align="center"
            :width="tablelength * 130">
            <template slot-scope="scope">
              <div class="flexbox">
                <div class="prodtable_column" v-for="item in scope.row.detail" :key="item.processNo">
                  <!-- :style="{ height: !(item.processNo && item.processName) ? '23px' : '' }" -->
                  <div class="title">{{ item.processNo }}{{ item.processName }}</div>
                  <div class="value" :style="{ backgroundColor: item.color ? item.color : 'transparent' }">
                    <div>{{ item.dispDoMember }}</div>
                    <!-- <div>{{ item.dispDoMember }}</div> -->
                    <div> {{ item.actStarttime ?
                        `${moment(item.actStarttime).format('YY-MM-DD hh:mm:ss')}
                                          ~ ${item.actEndtime ? moment(item.actEndtime).format('YY-MM-DD hh:mm:ss') : ''}` : ''
                    }}</div>
                  </div>
                </div>
              </div>
            </template>


          </el-table-column>

        </el-table>
        <el-pagination layout="total,prev, pager, next" :total="total" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
// import appService from "@njsdata/app-sdk";
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import screenfull from 'screenfull/dist/screenfull'
import eventActionDefine from "./components/msgCompConfig";
import axios from '@/api/asset.js'
import axios1 from '@/api/request.js'
import "./index.css";
export default {
  name: "App",
  props: {
    customConfig: Object,
    info: Object,
  },
  data() {
    return {
      value1: '',
      orderid: '',
      partsid: '',
      inscode: '',
      total: null,
      fullStatus: false,
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      tablecc: [],
      pageNum: 1,
    }
  },
  // watch: {
  //   // tablecc: {
  //   //   handler() {
  //   //     console.log(this.tablecc);
  //   //     // this.tablecc.forEach(x => {
  //   //     let temp = document.querySelector('.prd_address')[3].clienHeight
  //   //     document.querySelector('.prd_address')[3].style.height = `${temp}px`
  //   //     console.log(document.querySelector('.prd_address')[3].style.height);
  //   //     // })
  //   //   },
  //   //   deep: true
  //   // }
  // },
  computed: {
    title() {
      return this.customConfig?.title || "数据构建";
    },
    desc() {
      return this.customConfig?.desc || "描述";
    },
    tablelength() {
      let arr = []
      this.tableData.forEach((x, i) => {
        if (arr.length < x.detail.length) {
          arr = x.detail
        }
      })

      return arr.length
    },

  },
  mounted() {
    axios.queryProdInstruction({}).then(res => {
      this.total = res.length
    })
    this.queryAll()

  },
  methods: {
    goBackFn() {
      window.history.go(-1)
    },
    handleCurrentChange(val) {
      this.queryAll(val)
      this.pageNum = val
    },
    exeportFn() {
      let planStartTime = this.value1.length > 0 ? this.value1[0].getTime().toString() : ''

      let planEndTime = this.value1.length > 0 ? (this.value1[1].getTime() + 24 * 60 * 60 * 1000).toString() : ''
      axios1.get(`productiveTask/exportProdInstruction?ordCode=${this.orderid}&compCode=${this.partsid}&planStartTime=${planStartTime}&planEndTime=${planEndTime}&pageNum=${this.pageNum}&pageSize=10`, { responseType: "blob" }).then(res => {
        var blob = res.data
        //  FileReader主要用于将文件内容读入内存
        var reader = new FileReader()
        reader.readAsDataURL(blob)
        // onload当读取操作成功完成时调用
        reader.onload = function (e) {
          var a = document.createElement('a')
          // 获取文件名fileName
          var fileName = res.headers['content-disposition'].split('=')
          fileName = fileName[fileName.length - 1]
          fileName = decodeURI(fileName)
          a.download = fileName
          a.href = e.target.result
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
        // console.log(res);
      })

    },
    fullscreenHandle() {
      let full = this.$refs.fullscreen
      if (this.fullStatus) {
        full.style.position = ''
        full.style.width = ''
        full.style.height = ''
        full.style.top = '0'
        full.style.left = '0'
      } else {
        full.style.position = 'fixed'
        full.style.width = '100vw'
        full.style.height = '100vh'
        full.style.top = '0'
        full.style.left = '0'

      }
      this.fullStatus = !this.fullStatus
      // if (!screenfull.enabled) {


      // }
      // screenfull.toggle();

    },
    queryAll(pageNum = 1, pageSize = 10) {
      let planStartTime = this.value1.length > 0 ? this.value1[0].getTime().toString() : ''

      let planEndTime = this.value1.length > 0 ? (this.value1[1].getTime() + 24 * 60 * 60 * 1000).toString() : ''
      let params = {
        ordCode: this.orderid,
        compCode: this.partsid,
        insCode: this.inscode,
        planStartTime,
        planEndTime,
        pageNum,
        pageSize,
        isNeedCount: 1,
      }
      axios.queryProdInstruction(params).then(res => {
        this.tableData = res
      })
    },
    restFn() {
      this.value1 = ''
      this.orderid = ''
      this.partsid = ''
      this.inscode = ''
      this.queryAll()
    },
    // triggerEvent() {
    //   let { componentId, appId } = this.customConfig || {};
    //   componentId &&
    //     appId &&
    //     window.eventCenter?.triggerEventNew({
    //       objectId: appId,
    //       componentId: componentId,
    //       type: "app",
    //       event: "onImgClick",
    //       payload: {
    //         value: "sasdasd",
    //       },
    //     });
    // },
    // do_EventCenter_messageSuccess() {
    //   alert("动作执行成功！");
    // },
    Event_Center_getName() {
      return "生产任务执行";
    },
  },
  destroyed() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-pagination {
  display: flex;
  justify-content: flex-end;
}

/deep/ .el-button {
  background: #5182e4;
  border-color: #5182e4;
}

.infoCard {
  padding: 20px 30px;
  background: #fff;

  .production_top {
    display: flex;
    flex-direction: column;
    // justify-content: flex-start;

    .productiont_button {
      align-self: end;
      margin-bottom: 40px;
    }

    .productiont_screen {
      display: flex;
      margin-bottom: 20px;

      .productiont_public {
        display: flex;
        margin-right: 20px;
        white-space: nowrap;
        align-items: center;

        /deep/ .el-date-editor .el-range-input {
          margin-left: 5px;
        }
      }

    }
  }

  .production_table {

    .prodtable_title {
      // margin: auto;
      text-align: center;
      font-size: 24px;
      font-weight: 900;
    }

  }

}



/deep/ td.prd_address {
  display: flex;
  height: auto;
  padding: 0 !important;

  .cell {
    flex: 1;
    padding: 0 !important;
    // height: 71px;

    .flexbox {
      display: flex;
      height: 100%;
      // overflow-x: hidden;

      .prodtable_column {
        display: flex;
        flex-direction: column;
        width: 130px;
        // flex: 1;
        flex-shrink: 0;

        .title {
          background: #f2f2f2;

          // flex: 1;
          font-size: 16px;
          font-weight: 900;
        }

        .value {
          // height: 69px;
          flex: auto;
          color: #000;

          div {}
        }
      }
    }
  }
}

.prodtble_body {
  .prodtable_column {
    // border: 1px solid #ddd;

    .title {
      border: 1px solid #ddd;
      border-bottom: none;
      border-top: none;
      border-left: none;
    }

    .value {
      border: 1px solid #ddd;
      border-bottom: none;
      border-left: none;

    }
  }
}
</style>