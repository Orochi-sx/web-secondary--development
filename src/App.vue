<template>
  <div class="Filterpanel">
    <div class="filterHeader">
      <div class="filhead_left">筛选条件</div>
      <!-- <h3>筛选条件</h3> -->
      <div class="filhead_right">
        <el-button icon="el-icon-refresh-right" class="rest" @click="restFn">重置</el-button>
        <el-button icon="el-icon-search" class="search" @click="queryAll()" type="primary">筛选</el-button>
      </div>

    </div>
    <div class="filterTime"><span>上报时间</span>
      <el-date-picker popper-class="defalutP" v-model="value1" type="daterange" :default-value="defvalue"
        :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
      </el-date-picker>
    </div>
    <div class="filterTable">
      <el-table :data="tableData" stripe border>
        <el-table-column prop="reportTime" sortable label="上报时间"></el-table-column>
        <el-table-column prop="data" sortable label="原始值">
          <template slot-scope="scope">
            <div class="tableFlex">
              <div :class="{ tableTitle: true, requestFlag: !scope.row.requestFlag }"
                @click="notificationFn(scope.row.deviceId, scope.row.data, scope.row.requestFlag)">
                {{
                    scope.row.data
                }}</div>
              <!-- <div :class="{ tableTitle: true, requestFlag: !scope.row.requestFlag }"
                @click="notificationFn(scope.row.deviceId, scope.row.data)" :temp="scope.row.requestFlag"
                :temp1="JSON.stringify(scope.row)">
                弹框图片
              </div> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4"
        :page-sizes="[10, 15, 20, 25]" :page-size="10" layout="total, prev, pager, next, sizes, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="" :visible.sync="dialogVisible" width="30%">
      <img v-if="imgSrc" height='100%' width='100%' :src="imgSrc" alt="拉取图片失败">
      <div class="Dlo_temp" v-else>拉取图片失败</div>
    </el-dialog>



  </div>
</template>

<script>
// import appService from "@njsdata/app-sdk";
import eventActionDefine from "./components/msgCompConfig";

import { queryPropertiesHistoryData, queryWarnPicture } from './api/asset'
import qs from "querystringify";
import "./index.css";
export default {
  data() {
    return {
      dialogVisible: false,
      value1: [new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 2), new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 2)],
      defvalue: [new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 2)],
      currentPage4: 1,
      params: {
        pageSize: 10,
        pageNum: 1,
        queryParams: [],
      },
      imgSrc: null,
      pickerOptions: {
        disabledDate(time) {
          let now = new Date();   //获取此时的时间
          let nowData = new Date(  //获取此时年月日的后一天
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1 //获取明天
          );
          let oneMonthAgo = new Date(  //获取一个月之前的时间
            now.getFullYear(),
            now.getMonth() - 1,  //获取上一个月
            now.getDate() + 1   //将多算的一天减掉
          );
          return (
            time.getTime() > nowData.getTime() - 1000  //可以选择到今天的xxx:xxx:xxx:23:59:59，只有的全部disabled
            || time.getTime() < oneMonthAgo.getTime()  //小于一个月的全部disabled掉
          );
        },
      },
      total: 0,
      queryT: {},
      tableData: [

      ],
      eventid: ''
    }
  },
  name: "App",
  props: {
    customConfig: Object,
    info: Object,
  },
  computed: {
    title() {
      return this.customConfig?.title || "数据构建";
    },
    desc() {
      return this.customConfig?.desc || "描述";
    },
  },
  created() {
    const temp = qs.parse(window.location.search.substring(1))
    this.queryT = { deviceId: temp.deviceId, productId: temp.productId, identifier: temp.identifier }
  },
  mounted() {
    // this.queryAll()
    queryPropertiesHistoryData(this.queryT, { pageSize: 10, pageNum: 1, queryParams: [] }).then(res => {
      this.tableData = res.data.results
      this.total = res.data.totalCount
    })
    let { componentId } = this.customConfig || {};
    componentId &&
      window.componentCenter?.register(
        componentId,
        "comp",
        this,
        eventActionDefine
      );
  },
  methods: {
    restFn() {
      this.value1 = null
      this.queryAll()
    },
    async queryImgSrc(deviceid, eventid) {
      try {
        const { data } = await queryWarnPicture({ deviceid, eventid })
        console.log(data, '=============');
        this.imgSrc = data.picUrl
      } catch (error) {
        this.imgSrc = ''
      }
    },
    async queryAll() {
      this.params.queryParams = this.value1 ? [{ colName: "reportTime", datatype: 6, type: 111, value: this.value1[0].getTime() }, { colName: "reportTime", type: 113, datatype: 6, value: this.value1[1].getTime() + (1000 * 60 * 60 * 24) - 1 }] : []
      this.value1 ? console.log(new Date(this.value1[0]), new Date(this.value1[1].getTime() + (1000 * 60 * 60 * 24) - 1)) : null;
      try {
        // const { data } = await queryPropertiesHistoryData({ deviceId: '11ab8e48592a4ad7aa300cb1b53f341a', productId: '71084667-e645-48b1-ab82-89ebb213fc49', identifier: 'data' }, this.params)
        const { data } = await queryPropertiesHistoryData(this.queryT, this.params)
        this.tableData = data.results
        this.total = data.totalCount
      } catch (error) {
      }
    },
    notificationFn(value, eventid, requestFlag) {
      if (!requestFlag) return
      this.queryImgSrc(value, eventid)
      this.dialogVisible = true
    },

    handleSizeChange(val) {
      this.params.pageSize = val
      this.queryAll()
    },
    handleCurrentChange(val) {
      this.params.pageNum = val
      this.queryAll()
    },
    goToStudy() {
      window.open(this.customConfig?.url || "http://baidu.com");
    },
    getData() {
    },
    triggerEvent() {
      let { componentId, appId } = this.customConfig || {};
      componentId &&
        appId &&
        window.eventCenter?.triggerEventNew({
          objectId: appId,
          componentId: componentId,
          type: "app",
          event: "onImgClick",
          payload: {
            value: "sasdasd",
          },
        });
    },
    do_EventCenter_messageSuccess() {
      alert("动作执行成功！");
    },
    Event_Center_getName() {
      return "定制设备属性数据列表页";
    },
  },
  destroyed() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  },
};
</script>

<style lang="less" scoped>
.Filterpanel {

  padding: 20px;
  background-color: white;

  .filterHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .filhead_left {
      font-weight: 900;
      font-size: 20px;
    }

    .rest {
      border-radius: 2px;

      &:hover {
        background-color: #fff;
        border-color: #DCDFE6;
        color: #606266;
      }
    }

    .search {
      background-color: #0454f2;
      border-color: #0454f2;
      border-radius: 2px;
    }
  }

  .filterTime {
    padding-left: 90px;
    padding-bottom: 60px;

    span {
      margin-right: 10px;
    }

    /deep/ .el-date-editor .el-range-separator {
      width: 6%;
    }

    /deep/.el-picker-panel .el-picker-panel__body .el-date-table__row .default {
      div {
        color: red;
      }
    }
  }

  .filterTable {
    /deep/.el-table__row--striped td.el-table__cell {
      background-color: #f6f6f6;
    }

    .tableFlex {
      display: flex;
      justify-content: space-between;

      .tableTitle {
        margin-right: 60px;
        color: #66b1ff;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }

      .requestFlag {
        // display: none;
        color: #606266;
        cursor: default;
      }
    }

    .el-pagination {
      display: flex;
      justify-content: flex-end;
    }
  }

  .Dlo_temp {
    width: 100%;
    height: 300px;
    font-size: 28px;
    color: #CCCCCC;
    line-height: 200px;
    text-align: center;
  }
}
</style>