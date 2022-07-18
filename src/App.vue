<template>
  <div class="Filterpanel">
    <div class="filterHeader">
      <div class="filhead_left">筛选条件</div>
      <div class="filhead_right">
        <el-button icon="el-icon-refresh-right">重置</el-button>
        <el-button icon="el-icon-search" type="primary">筛选</el-button>
      </div>

    </div>
    <div class="filterTime"><span>上报时间</span>
      <el-date-picker @focus="defalutStyleFn" popper-class="defalutP" v-model="value1" type="daterange"
        :default-value="defvalue" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
    </div>
    <div class="filterTable">
      <el-table :data="tableData" stripe border>
        <el-table-column prop="sbsj" sortable label="上报时间"></el-table-column>
        <el-table-column prop="ysz" sortable label="原始值"></el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4"
        :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
    </div>
  </div>
</template>

<script>
// import appService from "@njsdata/app-sdk";
import eventActionDefine from "./components/msgCompConfig";
import "./index.css";
export default {

  data() {
    return {
      value1: [new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 2), undefined],

      defvalue: [new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 2)],
      // defvalue: new Date('2022-6-24'),
      currentPage4: 1,
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
      tableData: [
        { sbsj: '2', ysz: '3' },
        { sbsj: '1', ysz: '5' },
        { sbsj: '3', ysz: '9' },
        { sbsj: '2', ysz: '3' },
        { sbsj: '1', ysz: '5' },
        { sbsj: '3', ysz: '9' },
        { sbsj: '2', ysz: '3' },
        { sbsj: '1', ysz: '5' },
        { sbsj: '3', ysz: '9' },
        { sbsj: '2', ysz: '3' },
        { sbsj: '1', ysz: '5' },
        { sbsj: '3', ysz: '9' },
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
  },
  methods: {

    testFn() {
      console.log(this.value1);
    },
    defalutStyleFn() {
      // document.querySelector('.defalutP .el-date-table .el-date-table__row>.default div').style.color = 'red'
      this.$nextTick(() => {
        document.querySelector('.defalutP .el-date-table .el-date-table__row .default ').style.color = 'red'
        // console.log(document.querySelector('.defalutP .el-date-table .el-date-table__row>.default div  ').style);
      })

    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
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

    .el-pagination {
      display: flex;
      justify-content: flex-end;
    }
  }


}
</style>