<template>
  <div class="Filterpanel">
    <div class="filterHeader">
      <div class="filhead_left">筛选条件</div>
      <div class="filhead_right">
        <el-button icon="el-icon-refresh-right" @click="restFn">重置</el-button>
        <el-button icon="el-icon-search" @click="queryAll()" type="primary">筛选</el-button>
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
        <el-table-column prop="remaining_watt_hour" sortable label="原始值">
          <template slot-scope="scope">
            <div class="tableFlex">
              <div>
                {{
                    scope.row.remaining_watt_hour
                
                }}</div>
              <div :class="{ tableTitle: true, requestFlag: !scope.row.requestFlag }"
                @click="notificationFn(scope.row.deviceId)" :temp="scope.row.requestFlag"
                :temp1="JSON.stringify(scope.row)">
                弹框图片
              </div>
            </div>

          </template>

        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4"
        :page-sizes="[10, 15, 20, 25]" :page-size="10" layout="total, prev, pager, next, sizes, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="图片弹框" :visible.sync="dialogVisible" width="30%">
      <img height='100%' width='100%' :src="imgSrc" alt="">

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
      imgSrc: 'http://mms2.baidu.com/it/u=412522572,3814561694&fm=253&app=138&f=JPEG&fmt=auto&q=75?w=950&h=500',
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
        onPick(date) {
          console.log(date);
        }
      },
      total: 10,
      queryT: {},
      tableData: [
        { reportTime: '2', remaining_watt_hour: '3', requestFlag: 1 },
        { reportTime: '1', remaining_watt_hour: '5' },
        { reportTime: '3', remaining_watt_hour: '9' },
        { reportTime: '2', remaining_watt_hour: '3' },
        { reportTime: '1', remaining_watt_hour: '5' },
        { reportTime: '3', remaining_watt_hour: '9' },
        { reportTime: '2', remaining_watt_hour: '3', requestFlag: 1 },
        { reportTime: '1', remaining_watt_hour: '5' },
        { reportTime: '3', remaining_watt_hour: '9' },
        { reportTime: '2', remaining_watt_hour: '3' },
        { reportTime: '1', remaining_watt_hour: '5', requestFlag: 1 },
        { reportTime: '3', remaining_watt_hour: '9' },
      ]
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
    console.log(temp, '=======参数');
    this.queryT = { deviceId: temp.deviceId, productId: temp.productId, identifier: temp.identifier }
    console.log(this.queryT, '========================第一次的参数');
  },
  mounted() {
    // this.queryAll()
    this.queryImgSrc()
    queryPropertiesHistoryData({ deviceId: '11ab8e48592a4ad7aa300cb1b53f341a', productId: '71084667-e645-48b1-ab82-89ebb213fc49', identifier: 'remaining_watt_hour' }, { pageSize: 10, pageNum: 1, queryParams: [] }).then(res => {
      // console.log(res, '==============================ddd');
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
    async queryImgSrc() {
      try {
        const { data } = await queryWarnPicture({ deviceid: 'f8270e5d2c5c48e29bc68a6991759b44', eventid: 111 })
      } catch (error) {
      }
    },
    async queryAll() {
      this.params.queryParams = this.value1 ? [{ colName: "reportTime", datatype: 6, type: 111, value: this.value1[0].getTime() }, { colName: "reportTime", type: 113, datatype: 6, value: this.value1[1].getTime() + 1000 * 60 * 60 * 24 }] : []
      try {
        // const { data } = await queryPropertiesHistoryData({ deviceId: '11ab8e48592a4ad7aa300cb1b53f341a', productId: '71084667-e645-48b1-ab82-89ebb213fc49', identifier: 'remaining_watt_hour' }, this.params)
        console.log(this.queryT, '===============路由参数');
        const { data } = await queryPropertiesHistoryData(this.queryT, this.params)
        this.tableData = data.results
        this.total = data.totalCount
      } catch (error) {
      }
    },
    notificationFn(value) {
      console.log(value, '=============弹框值');
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
      //   console.log(appService.getMenuData(), "菜单");
      //   console.log(appService.getPageData(), "页面");
      //   console.log(appService.getVariable(), "变量");
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
      return "应用二开测试";
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

    .filhead_left {
      font-weight: 900;
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
        display: none;
      }
    }

    .el-pagination {
      display: flex;
      justify-content: flex-end;
    }
  }


}
</style>