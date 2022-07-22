<template>
  <div class="multiFfilterDataGrid">
    <div class="header">
      <div class="card-title">
        {{ title }}
      </div>
      <div class="total">{{ allTableList.length }}</div>
      <div>
        <el-button type="primary" class="multiConditionButton" @click="handleButtonClick">{{ buttonTitle }}
        </el-button>
      </div>
    </div>
    <div class="inputSearch" v-for="item in inputSearchArr">
      <el-input v-model="item.value" style="margin-top: 5px" @change="load"></el-input>
    </div>
    <div class="select" v-for="(selectList, index) in selectSearchArr">
      <el-select style="width: 100%; margin-top: 5px" v-model="selectValueArr[index]" clearable @change="load">
        <el-option v-for="(item, index) in selectList" :key="index" :label="item.label" :value="item.value">{{
            item.label
        }}
        </el-option>
      </el-select>
    </div>
    <el-table :data="displayTableList" highlight-current-row @row-click="handleRowClick" ref="myTable">
      <div v-for="item in tableDisplayFieldName">
        <el-table-column :sortable="sortConfig.indexOf(item) > -1" :prop="item"></el-table-column>
      </div>
    </el-table>
    <div class="fenye">
      <div @click="demoClick(item, index)" :class="currentIndex === index ? 'active' : ''" class="fenyeItem"
        v-for="(item, index) in flagArr" :key="index">
        {{ item }}

      </div>

    </div>
    <!-- <div style="width: 100%" class="pagaNation">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :total="1000"
        :current-page.sync="currentPage" :pager-count=5 :page-sizes="[10, 20, 50, 100]" :page-size.sync="pageSize"
        layout="prev, pager, next">
      </el-pagination>
    </div> -->

  </div>
</template>

<script>
import eventActionDefine from "./components/msgCompConfig";
import "./index.css";
import _ from "lodash";
import { queryAssetById } from "@/api/asset.js";

export default {
  name: "App",
  props: {
    customConfig: Object,
  },
  data() {
    return {
      title: "",
      buttonTitle: "",
      inputSearchArr: [],
      selectSearchArr: [],
      selectValueArr: [],
      tableDisplayFieldName: "",
      currentPage: 1,
      total: 0,
      pageSize: 10,
      allTableList: [],
      displayTableList: [
      
      ],
      inputSelectConfig: {},
      selectFilterCondition: [],
      inputFilterCondition: [],
      originTableData: {},
      sortConfig: [],
      firstRowInfo: {},
      componentId: "",
      selectArr: [],
      isMap: Boolean,
      flagArr: [],
      showButton: 0,
      spliceArr: [],
      pageNums: 0,
      currentIndex: 0,
      splitItemArr: [],
      fix:[]
    };
  },
  computed: {
    allFilterCondition() {
      let inputFilterCondition = [];
      let selectFilterCondition = [];
      try {
        this.inputSelectConfig.select.forEach((item, index) => {
          let selectFilterConditionItem = {};
          selectFilterConditionItem[item.displayField] =
            this.selectValueArr[index];
          selectFilterConditionItem.mapField =
            this.inputSelectConfig.select[index].mapField;
          selectFilterCondition.push(selectFilterConditionItem);
        });
        // let inputFilterCondition = []
        this.inputSelectConfig.input.forEach((item, index) => {
          let inputFilterConditionItem = {};
          inputFilterConditionItem[item] = this.inputSearchArr[index].value;
          inputFilterCondition.push(inputFilterConditionItem);
        });
      } catch (e) { }
      return [...inputFilterCondition, ...selectFilterCondition];
    },
  },
  async mounted() {
    let {
      title,
      showButton,
      buttonTitle,
      tableDisplayFieldName,
      assetId,
      inputSelectConfig,
      sortConfig,
      sortType,
    } = this.customConfig;

    this.sortConfig = sortConfig.split(",");

    this.title = title;
    this.showButton = showButton
    this.sortType = sortType;
    this.assetId = assetId;
    this.tableDisplayFieldName = tableDisplayFieldName.split(",");
    this.buttonTitle = buttonTitle;
    this.inputSelectConfig = JSON.parse(inputSelectConfig);
    //todo
    this.originTableData = await queryAssetById(assetId);
    for (let i = 0; i < this.showButton; i++) {
      this.flagArr.push(i + 1)
    }
    console.log('this.flagArr==', this.flagArr);

    this.handleTableData(this.originTableData);
    // this.handleSelectData();

    this.load();
    for (let i = 0; i < this.inputSelectConfig.input.length; i++) {
      this.inputSearchArr.push({ value: "" });
    }
    let { componentId } = this.customConfig || {};
    this.componentId = componentId;

    componentId &&
      window.componentCenter?.register(
        componentId,
        "comp",
        this,
        eventActionDefine
      );
  },
  methods: {
    demoClick(item, index) {
      console.log('item==1111', item);
      this.displayTableList = this.splitItemArr[item - 1]
      if (index == (this.showButton - 1)) {
        console.log('最后一个');
        this.currentIndex = 0
        let arr = []
        for (let i = 0; i < this.showButton; i++) {
          if (item <= this.pageNums) {
            arr.push(item)
            item++
          }
        }
        console.log('arr==', arr);
        this.flagArr = arr

      }
      else if (index == 0 && item !== 1) {
        console.log('第一个');
        this.currentIndex = (this.showButton - 1)
        let arr = []
        for (let i = 0; i < this.showButton; i++) {
          arr.unshift(item)
          item--
        }
        this.flagArr = arr

      } else {
        this.currentIndex = index

      }

      // this.load()


    },
    formDate(date) {
      let bzDate = new Date(date);
      let Y = bzDate.getFullYear() + "-";
      let M =
        (bzDate.getMonth() + 1 < 10
          ? "0" + (bzDate.getMonth() + 1)
          : bzDate.getMonth() + 1) + "-";
      let D = bzDate.getDate() + " ";
      let h = bzDate.getHours() + ":";
      let m = bzDate.getMinutes() + ":";
      let s = bzDate.getSeconds();
      return Y + M + D + h + m + s;
    },
    filterDataBySearchAndSelect(allTableList) {
      console.log("this.allFilterCondition==", this.allFilterCondition);
      let result = [];
      result = allTableList.filter((item) => {
        return this.allFilterCondition.every((filterCondition) => {
          let filterConditionKey = Object.keys(filterCondition)[0];
          let filterConditionValue = filterCondition[filterConditionKey] || "";
          if (filterCondition.mapField) {
            return item[filterCondition.mapField].indexOf(filterConditionValue) > -1;
          } else {
            return item[filterConditionKey].indexOf(filterConditionValue) > -1;
          }
        });
      });
      debugger;
      return result;
    },
    async load() {

      let { componentId } = this.customConfig || {};
      //todo
      this.originTableData = await queryAssetById(this.assetId);
      this.handleTableData(this.originTableData);
      console.log("this,allTableList==", this.allTableList);

      //todo
      this.displayTableList = this.filterDataBySearchAndSelect(
        this.allTableList
      );


      console.log('displayTableList==', this.displayTableList);

      //todo
      if (this.sortConfig[1] && this.sortConfig[1] === "dateTime") {
        this.displayTableList.forEach((d) => {
          d[this.sortConfig[0]] = new Date(d[this.sortConfig[0]]).getTime();
        });
        if (this.sortType === "ascending") {
          this.displayTableList = this.displayTableList.sort((a, b) => {
            return a[this.sortConfig[0]] - b[this.sortConfig[0]];
          });
        } else {
          this.displayTableList = this.displayTableList.sort((a, b) => {
            return b[this.sortConfig[0]] - a[this.sortConfig[0]];
          });
        }
        this.displayTableList.forEach((item) => {
          item[this.sortConfig[0]] = this.formDate(item[this.sortConfig[0]]);
        });
      } else {
        let infoType;
        console.log("displayTableList===", this.displayTableList);
        infoType = this.displayTableList.every((d) => {
          return Number(d[this.sortConfig[0]] !== "NaN");
        });
        console.log("infoType==", infoType);
        if (infoType) {
          if (this.sortType === "ascending") {
            this.displayTableList = this.displayTableList.sort((a, b) => {
              return a[this.sortConfig[0]] - b[this.sortConfig[0]];
            });
          } else {
            this.displayTableList = this.displayTableList.sort((a, b) => {
              return b[this.sortConfig[0]] - a[this.sortConfig[0]];
            });
          }
        } else {
          if (this.sortType === "ascending") {
            this.displayTableList = this.displayTableList.sort((a, b) => {
              return a[this.sortConfig[0]].localeCompare(
                b[this.sortConfig[0]],
                "zh"
              );
            });
          } else {
            this.displayTableList = this.displayTableList.sort((a, b) => {
              return a[this.sortConfig[0]].localeCompare(
                b[this.sortConfig[0]],
                "zh"
              );
            });
          }
        }
      }
      this.pageNums = Math.ceil(this.displayTableList.length / this.pageSize)
      console.log('pageNums', this.pageNums);
      for (let i = 0; i < this.pageNums; i++) {
        let start = i * 10
        let end = start + 10
        this.splitItemArr.push(this.displayTableList.slice(start, end))
      }
      console.log('splitItemArr==', this.splitItemArr);
      this.displayTableList = this.splitItemArr[0]

      // this.displayTableList = this.filterDataBypagination(
      //   this.displayTableList
      // );


      this.firstRowInfo = this.displayTableList[0];

      this.$refs.myTable.setCurrentRow(this.displayTableList[0]);
      window.eventCenter?.triggerEvent(componentId, "load", {
        rowInformation: this.firstRowInfo,
      });
    },
    handleButtonClick() {
      this.inputSelectConfig.select = [];
      this.inputSearchArr.forEach((d) => {
        d.value = "";
      });
      this.inputSelectConfig.input = [];
      this.selectValueArr = [];

      this.load();
      this.currentPage = 1;

      let { componentId, appId } = this.customConfig || {};
      componentId &&
        appId &&
        window.eventCenter?.triggerEvent(componentId, "buttonClick", {});
    },
    //将平台的数据转化为正常使用的数据形式
    translatePlatformDataToJsonArray(originTableData) {
      let originTableHeader = originTableData.data[0];
      let tableHeader = [];
      originTableHeader.forEach((item) => {
        tableHeader.push(item.col_name);
      });
      let tableBody = originTableData.data[1];
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
    handleTableData(originTableData) {
      let tableData = this.translatePlatformDataToJsonArray(originTableData);
      this.allTableList = tableData;
    },
    async handleSelectData() {
      //todo
      for (let i = 0; i < this.inputSelectConfig.select.length; i++) {
        this.selectArr.push(
          await queryAssetById(this.inputSelectConfig.select[i].selectAssetId)
        );
      }
      console.log("this.selectArr==1111", this.selectArr);
      var flagArr = [];
      this.selectArr.forEach((item) => {
        flagArr.push(this.translatePlatformDataToJsonArray(item));
      });
      let displayMapping;
      try {
        displayMapping = this.inputSelectConfig.select;
      } catch (error) {
        console.log("传入的数据不合法");
      }
      displayMapping.forEach((displayMappingItem, index) => {
        let selectList = [];
        flagArr[index].forEach((selectDataItem) => {
          selectList.push({
            label: selectDataItem[displayMappingItem["displayField"]],
            value: selectDataItem[displayMappingItem["valueField"]],
          });
        });
        this.selectSearchArr.push(selectList);
      });
    },
    filterDataBypagination(data) {
      this.total = data.length;
      if ((this.currentPage - 1) * this.pageSize >= this.total) {
        this.currentPage =
          Math.ceil(this.total / this.pageSize) == 0
            ? 1
            : Math.ceil(this.total / this.pageSize);
      }
      return data.slice(
        (this.currentPage - 1) * this.pageSize,
        Math.min(this.currentPage * this.pageSize, this.total)
      );
    },
    handleRowClick(row) {
      let { componentId, appId } = this.customConfig || {};
      componentId &&
        appId &&
        window.eventCenter?.triggerEvent(componentId, "rowClick", {
          rowInformation: row,
        });
    },
    handleSizeChange() {
      this.load();
    },
    handleCurrentChange() {
      this.load();
    },
    do_EventCenter_load() {
      this.load();
    },
    // do_EventCenter_reset(){
    //
    // },
    Event_Center_getName() {
      return "多重过滤数据表格列表";
    },
  },
  destroyed() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  },
};
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  /* box-sizing: border-box; */
}

.header {
  display: flex;
  justify-content: space-around;
  height: 50px;
  line-height: 50px;
}

.multiConditionButton {
  padding: 10px;
}

.header .card-title {
  font-size: 20px;
  font-weight: bold;
}

.header .total {
  color: #409eff;
}

.multiFfilterDataGrid>>>.el-table__header-wrapper {
  height: 50px;
}

.multiFfilterDataGrid>>>.el-table__row.current-row {
  color: #409eff;
}

.multiFfilterDataGrid>>>.el-table__body tr.current-row>td.el-table__cell {
  background-color: #fff;
}

.multiFfilterDataGrid>>>.el-table {
  max-height: 550px;
}

.multiFfilterDataGrid>>>.el-table .el-table__cell {
  border-bottom: 0;
}

.multiFfilterDataGrid>>>.el-table--border::after,
.el-table--group::after,
.el-table::before {
  z-index: 0;
}

.multiFfilterDataGrid>>>.el-table__header-wrapper {
  display: none;
}

.pagaNation {
  background: #ffffff;
  padding: 10px;
}

.pagaNation>>>.el-pagination {
  width: 100%;
  height: 50px;
  background: #ffffff;
  transform: scale(0.6);
  transform-origin: bottom left;

}

/deep/ .el-select-dropdown__item {
  padding-left: 10px !important;

}

.active {
  color: #409eff;
}

.fenye {
  display: flex;
  width: 100%;
  height: 50px;
  flex-shrink: 0;
  justify-content: center;
  background: #ffffff;
  padding: 20px 0;

}

.fenyeItem {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  cursor: pointer;
  text-align: center;
  line-height: 50px;

}
</style>
