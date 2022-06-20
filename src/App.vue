<template>
  <div class="mian">
    <div v-for="(item, index) in searchDataList" class="choose" :key="index">
      <div v-show="item.showList.length > 0">
        <p>{{ item.level }}<i></i></p>
        :
        <el-checkbox-group
          v-if="item.selectLimit && item.selectLimit > 1"
          fill="transparent"
          text-color="#0BA0F0"
          v-model="radioArray[index]"
          size="mini"
          :max="item.selectLimit"
          @change="checkboxChange($event, index)"
        >
          <el-checkbox-button
            v-for="itemSon in item.showList"
            :key="itemSon.data_id"
            :label="itemSon"
            >{{ itemSon.labelName }}</el-checkbox-button
          >
        </el-checkbox-group>
        <el-radio-group
          v-else
          @change="checkboxChange($event, index)"
          fill="transparent"
          text-color="#0BA0F0"
          v-model="singleArray[index]"
          size="mini"
          :max="item.selectLimit"
        >
          <el-radio-button
            v-for="itemSon in item.showList"
            :key="itemSon.data_id"
            :label="itemSon"
            >{{ itemSon.labelName }}</el-radio-button
          >
          ></el-radio-group
        >
      </div>
      <div
        class="divider"
        v-if="searchDataList[index + 1] && !searchDataList[index + 1].parent"
      ></div>
    </div>
  </div>
</template>

<script>
import eventActionDefine from "./components/msgCompConfig";
// import childChoose from "./components/childChoose.vue";
import { queryAssetById } from "./api/asset";
import "./index.css";
export default {
  name: "App",
  props: {
    customConfig: Object,
    info: Object,
  },
  data() {
    return {
      optionDate: [],
      searchDataList: [],
      radioArray: [],
      singleArray: [],
      indexArray: [],
      allLabel: [],
      sendField: {},
    };
  },
  created() {
    this.optionDate = JSON.parse(this.customConfig.chooseList);
    this.optionDate.forEach((item, index) => {
      this.indexArraySove(item);
    });
    this.indexArray.forEach((item, index) => {
      this.radioArray[index] = [];
      this.singleArray[index] = "";
      this.solveArray(item, index);
    });
    console.log(this.searchDataList);
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
    translatePlatformDataToJsonArray(originTableData, label, type) {
      let originTableHeader = originTableData.data[0];
      let tableHeader = [];
      let tableDataFor = [];
      originTableHeader.forEach((item) => {
        tableHeader.push(item.col_name);
      });
      let tableBody = originTableData.data[1];
      let tableData = [];
      tableBody.forEach((tableItem) => {
        let temp = {};
        tableItem.forEach((item, index) => {
          temp[tableHeader[index]] = item;
          temp.level = label;
        });
        tableDataFor.push(temp);
      });
      tableDataFor.forEach((forItem, forIndex) => {
        if (type) {
          if (forItem.type && forItem.type == type) {
            tableData.push(forItem);
          }
        } else {
          tableData = tableDataFor;
        }
      });
      return tableData;
    },
    indexArraySove(item) {
      this.indexArray.push(item);
      if (item.child) {
        this.indexArraySove(item.child);
      } else return;
    },
    solveArray(item, index) {
      let message = {
        level: item.filterLabel,
        selectLimit: item.selectLimit,
        showList: [],
        storageList: [],
        sendField: item.sendField,
        parent: item.parent ? item.parent : "",
      };
      queryAssetById(item.assertsId).then((res) => {
        message.storageList = this.translatePlatformDataToJsonArray(
          res,
          item.filterLabel,
          item.type
        );
        message.storageList.forEach((item2, index2) => {
          item2.labelName = item2[item.displayField];
          item2.data_id = item2[item.valueField];
          this.allLabel.push(item2);
          if (!item2.parent_id) {
            message.showList.push(item2);
          }
        });
      });
      this.$set(this.searchDataList, [index], message);
    },
    checkboxChange(val, index) {
      let receive = [];
      if (Array.isArray(val)) {
        receive = val;
      } else {
        receive[0] = val;
        this.radioArray[index][0] = val;
      }
      let message = [];
      this.allLabel.forEach((item, allLabelIndex) => {
        receive.forEach((valItem, valIndex) => {
          if (valItem.data_id == item.parent_id) {
            message.push(item);
          }
        });
      });
      if (this.searchDataList[index + 1]) {
        if (this.searchDataList[index + 1].parent) {
          this.radioArray[index + 1] = [];
          this.searchDataList[index + 1].showList = message;
        }
      }
      for (
        let searchIndex = 0;
        searchIndex < this.searchDataList.length;
        searchIndex++
      ) {
        if (searchIndex > index) {
          if (
            this.searchDataList[searchIndex].parent &&
            this.searchDataList[searchIndex + 1] &&
            this.searchDataList[searchIndex + 1].parent
          ) {
            this.searchDataList[searchIndex + 1].showList = [];
            this.radioArray[searchIndex + 1] = [];
          } else if (this.searchDataList[searchIndex].parent == "") {
            break;
          }
        }
      }
      this.radioArray.forEach((radioItem, radioIndex) => {
        let message = [];
        radioItem.forEach((sonItem, sonIndex) => {
          message.push(sonItem.data_id);
        });
        this.sendField[this.searchDataList[radioIndex].sendField] = message;
      });
      this.triggerEvent(this.sendField);
      // console.log(this.sendField, "<-----------------sendField");
    },
    triggerEvent(data) {
      let { componentId, appId } = this.customConfig || {};
      window.eventCenter?.triggerEventNew({
        objectId: appId,
        componentId: componentId,
        type: "app",
        event: "clickOption",
        payload: {
          value: data,
        },
      });
    },
    Event_Center_getName() {
      return "条件筛选";
    },
  },
  destroyed() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  },
};
</script>

<style lang="less" scoped>
.choose div:first-child {
  display: flex;
  justify-content: flex-start;
  width: 98%;
}
.choose {
  p {
    line-height: 28px;
    height: 28px;
    font-size: 14px;
    min-width: 80px;
    margin: 0;
    margin-right: 10px;
    text-align: justify;
    i {
      display: inline-block;
      width: 100%;
    }
  }
}
/deep/.is-checked span,
/deep/.is-active .el-radio-button__inner {
  font-weight: 700 !important;
}
/deep/.el-checkbox-button__inner,
/deep/.el-radio-button__inner {
  border: 0px !important;
  font-size: 14px;
  background-color: transparent !important;
}
.divider {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #f0f1f3;
}
</style>