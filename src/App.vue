<template>
  <div class="main">
    <!-- <el-date-picker
      v-show="optionType == '按月'"
      @change="changeMonth"
      value-format="yyyy-MM-dd"
      v-model="value1"
      type="monthrange"
      range-separator="至"
      start-placeholder="开始月份"
      end-placeholder="结束月份"
    >
    </el-date-picker> -->
    <el-date-picker v-model="value1" @change="changeMonth" v-show="optionType == '按月'" type="month" placeholder="选择月"> </el-date-picker>
    <quarter-picker
      v-show="optionType == '按季度'"
      width="150px"
      format="yyyy年q季度"
      value-format="yyyy-MM-dd"
      placeholder="选择季度"
      v-model="quarterDate"
      @change="changeQuarter"
    />
    <el-date-picker v-show="optionType == '按年'" @change="changeYear" v-model="value2" type="year" format="yyyy" placeholder="选择年" value-format="yyyy"> </el-date-picker>
    <iframe
      :src="`${origin}/previewPdfForExcel.html?templateId=${reportId}&startTime=${startTime}&endTime=${endTime}`"
      width="100%"
      :height="mainHeight"
      frameborder="0"
      scrolling="no"
      ref="iframe"
    >
    </iframe>
  </div>
</template>

<script>
// import appService from "@njsdata/app-sdk";
import eventActionDefine from "./components/msgCompConfig";
import QuarterPicker from "./components/quarter-picker/index.vue";
import moment from "moment";
import "./index.css";
export default {
  name: "App",
  components: {
    QuarterPicker,
  },
  data() {
    return {
      value1: null,
      value2: "",
      quarterDate: null,
      startTime: "",
      endTime: "",
      optionType: "按月",
      origin: "",
      nowYear: "",
      mainHeight: "",
      reportId: "",
    };
  },
  props: {
    customConfig: Object,
    info: Object,
  },
  computed: {},
  mounted() {
    //组件在平台的高度
    this.mainHeight = document.getElementsByClassName("application-content-wrap")[0].offsetHeight;
    let { componentId } = this.customConfig || {};
    componentId && window.componentCenter?.register(componentId, "comp", this, eventActionDefine);
    this.origin = window.location.origin;
    this.optionType = this.customConfig.表格查询时间类型 ? this.customConfig.表格查询时间类型 : "按月";
    this.reportId = this.customConfig.报表ID ? this.customConfig.报表ID : "";
    let now = new Date();
    this.nowYear = now.getFullYear();
    console.log(this.customConfig);
  },
  methods: {
    changeYear(val) {
      this.startTime = this.getCurrentYearFirst(new Date(`${val}`));
      this.endTime = this.getCurrentYearLast(new Date(`${val}`));
    },
    changeMonth(val) {
      this.startTime = moment(val).format("YYYY-MM-DD");
      this.endTime = this.getEndDate(val);
    },
    getEndDate(month) {
      let lastDay = new Date(month.getTime() - 1000 * 60 * 60 * 24).getDate(); // 获取当月最后一天日期
      let nowMonth = month.getMonth() + 1;
      if (nowMonth < 10) {
        nowMonth = "0" + nowMonth;
      }
      if (lastDay >= 0 && lastDay <= 9) {
        lastDay = "0" + lastDay;
      }
      return month.getFullYear() + "-" + nowMonth + "-" + lastDay;
    },
    changeQuarter(date) {
      this.startTime = date[0];
      this.endTime = date[1];
    },
    // 获取年第一天
    getCurrentYearFirst(date) {
      date = date ? date : new Date();
      date.setDate(1);
      date.setMonth(0);
      return this.startTimeMethod(date);
    },
    // 获取年最后一天
    getCurrentYearLast(date) {
      date = date ? date : new Date();
      date.setFullYear(date.getFullYear() + 1); // 设置到明年
      date.setMonth(0); // 明年的0月，也就是对应到1月，是存在的哦，不是不存在的0
      date.setDate(0); // 明年的0日
      return this.endTimeMethod(date);
    },
    startTimeMethod(time) {
      let nowTimeDate = new Date(time);
      nowTimeDate = nowTimeDate.setHours(0, 0, 0, 0);
      return moment(nowTimeDate).format("YYYY-MM-DD");
    },
    endTimeMethod(time) {
      let nowTimeDate = new Date(time);
      nowTimeDate = nowTimeDate.setHours(23, 59, 59, 999);
      return moment(nowTimeDate).format("YYYY-MM-DD");
    },
  },
  destroyed() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  },
};
</script>
<style lang="less" scoped>
.main {
  height: 100%;
  width: 100%;
}
/deep/.el-date-editor .el-range-separator {
  padding: 0;
}
</style>
