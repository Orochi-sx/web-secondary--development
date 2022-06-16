<template>
  <div class="main">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="日报" name="first">
        <el-button
          type="primary"
          size="small"
          class="timeButton"
          @click="getMonth('lastMonth')"
          ><上一月</el-button
        >
        <el-date-picker
          v-model="monthDate"
          size="small"
          class="datePicker"
          type="month"
          placeholder="选择月"
          format="yyyy-MM"
          value-format="yyyy-MM"
        >
        </el-date-picker>
        <el-button
          type="primary"
          size="small"
          class="timeButton"
          @click="getMonth('nextMonth')"
          >下一月></el-button
        >
        <el-button
          type="primary"
          size="small"
          class="timeButton"
          @click="searchInfo('getMonth')"
          >查询</el-button
        >
        <el-button
          type="primary"
          size="small"
          class="timeButton export"
          @click="exportClick('getMonth')"
          >导出</el-button
        >
        <el-card>
          <el-descriptions class="margin-top" :column="1" border>
            <el-descriptions-item>
              <template slot="label"> 电站名称 </template>
              {{ equipmentYearDate }}
            </el-descriptions-item>
            <el-descriptions-item v-if="searchType == '单选'">
              <template slot="label"> 客户名称 </template>
              {{ companyYearDate }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> 装机容量 </template>
              {{ capacityYearDate }}kWp
            </el-descriptions-item>
            <el-descriptions-item v-if="searchType == '单选'">
              <template slot="label"> 地址 </template>
              {{ addressYearDate }}
            </el-descriptions-item>
          </el-descriptions>
          <el-table
            v-if="activeName === 'first'"
            :header-cell-style="{ background: '#f8f8f8', color: 'black' }"
            :data="tableDataMonth"
            style="width: 100%"
            :cell-style="columnbackgroundStyle"
            :default-sort="{ prop: 'date', order: 'descending' }"
            show-summary
          >
            <el-table-column prop="days" label="日期" sortable width="100">
            </el-table-column>
            <el-table-column
              prop="generatingCapacity"
              label="发电量（kWh）"
              sortable
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="equivalentHours"
              label="等效时数（h）"
              sortable
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="carbonEmissions"
              label="碳减排（吨）"
              sortable
            >
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="月报" name="second">
        <el-button
          type="primary"
          size="small"
          class="timeButton"
          @click="getYear('lastYear')"
          ><上一年</el-button
        >
        <el-date-picker
          v-model="yearDate"
          size="small"
          class="datePicker"
          type="year"
          placeholder="选择年"
          format="yyyy"
          value-format="yyyy"
        >
        </el-date-picker>
        <el-button
          type="primary"
          size="small"
          class="timeButton"
          @click="getYear('nextYear')"
          >下一年></el-button
        >
        <el-button
          type="primary"
          size="small"
          class="timeButton"
          @click="searchInfo('getYear')"
          >查询</el-button
        >
        <el-button
          type="primary"
          size="small"
          class="timeButton export"
          @click="exportClick('getYear')"
          >导出</el-button
        >
        <el-card>
          <el-descriptions class="margin-top" :column="1" border>
            <el-descriptions-item>
              <template slot="label"> 电站名称 </template>
              {{ equipmentYearDate }}
            </el-descriptions-item>
            <el-descriptions-item v-if="searchType == '单选'">
              <template slot="label"> 客户名称 </template>
              {{ companyYearDate }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> 装机容量 </template>
              {{ capacityYearDate }}kWp
            </el-descriptions-item>
            <el-descriptions-item v-if="searchType == '单选'">
              <template slot="label"> 地址 </template>
              {{ addressYearDate }}
            </el-descriptions-item>
          </el-descriptions>
          <el-table
            v-if="activeName === 'second'"
            :header-cell-style="{ background: '#f8f8f8', color: 'black' }"
            :data="tableDataYear"
            style="width: 100%"
            :cell-style="columnbackgroundStyle"
            :default-sort="{ prop: 'date', order: 'descending' }"
            show-summary
          >
            <el-table-column prop="days" label="日期" sortable width="100">
            </el-table-column>
            <el-table-column
              prop="generatingCapacity"
              label="发电量（kWh）"
              sortable
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="equivalentHours"
              label="等效时数（h）"
              sortable
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="carbonEmissions"
              label="碳减排（吨）"
              sortable
            >
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="年报" name="three">
        <el-date-picker
          v-model="allYearDate"
          size="small"
          class="datePicker"
          type="month"
          placeholder="选择年"
          style="visibility: hidden"
        >
        </el-date-picker>
        <el-button
          type="primary"
          size="small"
          class="timeButton export"
          @click="exportClick('getAllYear')"
          >导出</el-button
        >
        <el-card>
          <el-descriptions class="margin-top" :column="1" border>
            <el-descriptions-item>
              <template slot="label"> 电站名称 </template>
              {{ equipmentYearDate }}
            </el-descriptions-item>
            <el-descriptions-item v-if="searchType == '单选'">
              <template slot="label"> 客户名称 </template>
              {{ companyYearDate }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> 装机容量 </template>
              {{ capacityYearDate }}kWp
            </el-descriptions-item>
            <el-descriptions-item v-if="searchType == '单选'">
              <template slot="label"> 地址 </template>
              {{ addressYearDate }}
            </el-descriptions-item>
          </el-descriptions>
          <el-table
            v-if="activeName === 'three'"
            :header-cell-style="{ background: '#f8f8f8', color: 'black' }"
            :data="tableDataAllYear"
            style="width: 100%"
            :cell-style="columnbackgroundStyle"
            :default-sort="{ prop: 'date', order: 'descending' }"
            show-summary
          >
            <el-table-column prop="days" label="日期" sortable width="100">
            </el-table-column>
            <el-table-column
              prop="generatingCapacity"
              label="发电量（kWh）"
              sortable
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="equivalentHours"
              label="等效时数（h）"
              sortable
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="carbonEmissions"
              label="碳减排（吨）"
              sortable
            >
            </el-table-column>
          </el-table> </el-card
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// import appService from "@njsdata/app-sdk";
import eventActionDefine from "./components/msgCompConfig";
import "./index.css";
import moment from "moment";
import { carbonAssetReport, exportCarbonAssetReport } from "./api/asset";
export default {
  name: "App",
  props: {
    customConfig: Object,
  },
  data() {
    return {
      monthDate: moment(new Date()).format("YYYY-MM"),
      yearDate: moment(new Date()).format("YYYY"),
      allYearDate: null,
      ids: "",
      activeName: "first",
      searchType: "单选",
      equipmentYearDate: null,
      capacityYearDate: null,
      companyYearDate: null,
      addressYearDate: null,
      tableDataMonth: [],
      tableDataYear: [],
      tableDataAllYear: [],
    };
  },
  computed: {
    title() {
      return this.customConfig?.title || "数据构建";
    },
    desc() {
      return this.customConfig?.desc || "描述";
    },
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
    // this.getMessage();
  },
  methods: {
    getMessage() {
      let params = {
        ids: this.ids,
        date: this.monthDate,
      };
      carbonAssetReport(params).then((res) => {
        this.tableDataMonth = res.data.detail;
        this.equipmentYearDate = res.data.name;
        this.capacityYearDate = res.data.machine_volume;
        if (this.searchType == "单选") {
          this.companyYearDate = res.data.belong_customer;
          this.addressYearDate = res.data.collector_address;
        }
      });
      params = {
        ids: this.ids,
        date: this.yearDate,
      };
      carbonAssetReport(params).then((res) => {
        this.tableDataYear = res.data.detail;
        this.equipmentYearDate = res.data.name;
        this.capacityYearDate = res.data.machine_volume;
        if (this.searchType == "单选") {
          this.companyYearDate = res.data.belong_customer;
          this.addressYearDate = res.data.collector_address;
        }
      });
      params = {
        ids: this.ids,
        date: "",
      };
      carbonAssetReport(params).then((res) => {
        this.tableDataAllYear = res.data.detail;
        this.equipmentYearDate = res.data.name;
        this.capacityYearDate = res.data.machine_volume;
        if (this.searchType == "单选") {
          this.companyYearDate = res.data.belong_customer;
          this.addressYearDate = res.data.collector_address;
        }
      });
    },
    getMonth(type) {
      if (type == "lastMonth") {
        this.monthDate = moment(this.monthDate)
          .subtract(1, "month")
          .startOf("month")
          .format("YYYY-MM");
      } else {
        this.monthDate = moment(this.monthDate)
          .add(1, "month")
          .startOf("month")
          .format("YYYY-MM");
      }
    },
    getYear(type) {
      if (type == "lastYear") {
        this.yearDate = moment(this.yearDate)
          .subtract(1, "year")
          .startOf("year")
          .format("YYYY");
        console.log(this.yearDate);
      } else {
        this.yearDate = moment(this.yearDate)
          .add(1, "year")
          .startOf("year")
          .format("YYYY");
      }
    },
    exportClick(type) {
      if (type == "getMonth") {
        const params = {
          ids: this.ids,
          date: this.monthDate,
        };
        exportCarbonAssetReport(params).then((res) => {
          const temp = res.headers["content-disposition"].split("=")[1];
          // 对文件名乱码转义--【Node.js】使用iconv-lite解决中文乱码
          let iconv = require("iconv-lite");
          iconv.skipDecodeWarning = true; //忽略警告
          let fileName = iconv.decode(temp, "utf-8");
          const _res = res.data;
          let blob = new Blob([_res]);
          let downloadElement = document.createElement("a");
          let href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download = fileName; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        });
      } else if (type == "getYear") {
        const params = {
          ids: this.ids,
          date: this.yearDate,
        };
        exportCarbonAssetReport(params).then((res) => {
          const temp = res.headers["content-disposition"].split("=")[1];
          // 对文件名乱码转义--【Node.js】使用iconv-lite解决中文乱码
          let iconv = require("iconv-lite");
          iconv.skipDecodeWarning = true; //忽略警告
          let fileName = iconv.decode(temp, "utf-8");
          const _res = res.data;
          let blob = new Blob([_res]);
          let downloadElement = document.createElement("a");
          let href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download = fileName; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        });
      } else {
        const params = {
          ids: this.ids,
          date: "",
        };
        exportCarbonAssetReport(params).then((res) => {
          const temp = res.headers["content-disposition"].split("=")[1];
          // 对文件名乱码转义--【Node.js】使用iconv-lite解决中文乱码
          let iconv = require("iconv-lite");
          iconv.skipDecodeWarning = true; //忽略警告
          let fileName = iconv.decode(temp, "utf-8");
          const _res = res.data;
          let blob = new Blob([_res]);
          let downloadElement = document.createElement("a");
          let href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download = fileName; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        });
      }
    },
    searchInfo(type) {
      if (type == "getMonth") {
        const params = {
          ids: this.ids,
          date: this.monthDate,
        };
        carbonAssetReport(params).then((res) => {
          this.tableDataMonth = res.data.detail;
          this.equipmentYearDate = res.data.name;
          this.capacityYearDate = res.data.machine_volume;
          if (this.searchType == "单选") {
            this.companyYearDate = res.data.belong_customer;
            this.addressYearDate = res.data.collector_address;
          }
        });
      } else {
        const params = {
          ids: this.ids,
          date: this.yearDate,
        };
        carbonAssetReport(params).then((res) => {
          this.tableDataYear = res.data.detail;
          this.equipmentYearDate = res.data.name;
          this.capacityYearDate = res.data.machine_volume;
          if (this.searchType == "单选") {
            this.companyYearDate = res.data.belong_customer;
            this.addressYearDate = res.data.collector_address;
          }
        });
      }
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    columnbackgroundStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0) {
        //让下标为0的列数的样式
        return "background:#f8f8f8;fontWeight:700";
      }
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总价";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        } else {
          sums[index] = "N/A";
        }
      });

      return sums;
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
    do_EventCenter_searchCharcoalInfo(value) {
      console.log(value,526);
      if (
        typeof value.charcoalId == "string" ||
        typeof value.charcoalId == "number"
      ) {
        this.searchType = "单选";
        this.ids = value.charcoalId;
      } else if (Array.isArray(value.charcoalId)) {
        this.searchType = "多选";
        this.ids = "";
        value.charcoalId.forEach((item, index) => {
          if (index > 0) {
            this.ids += "," + item.id;
          } else {
            this.ids = item.id;
          }
        });
      }
      this.getMessage();
      console.log(this.ids);
    },
    Event_Center_getName() {
      return "炭资产报表查询";
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
/deep/.el-tabs__item {
  text-align: center;
  width: 150px;
  border: 1px solid #d7d7d7 !important;
  border-left: 0px !important;
}
/deep/.el-tabs__item:first-child {
  border: 1px solid #d7d7d7 !important;
}
/deep/.el-tabs__header {
  border: 0px;
}
/deep/.el-tabs__nav {
  border: 0px !important;
}
/deep/.is-active {
  background-color: #409eff !important;
  border: #409eff 1px solid !important;
  color: #ffffff;
}
/deep/.is-bordered-label {
  font-weight: 700 !important;
  color: black;
}
/deep/.el-descriptions .is-bordered .el-descriptions-item__cell {
  padding: 12px 20px;
}
/deep/.el-descriptions-item__label {
  width: 100px !important;
  text-align: center;
}
/deep/.el-table {
  border-top-width: 0px;
  border-right: 1px solid #ebeef5 !important;
  border-bottom-width: 0px;
  border-left: 1px solid #ebeef5 !important;
}
/deep/ .el-table__footer-wrapper tbody td {
  background-color: white;
  font-weight: 700;
}
/deep/.has-gutter .is-leaf:first-child {
  background-color: #f8f8f8;
  font-weight: 700;
}
.el-card {
  margin-top: 20px;
}
.export {
  float: right;
}
.datePicker {
  margin-left: 10px;
  margin-right: 10px;
}
.timeButton {
  background: #2774f6;
}
</style>
