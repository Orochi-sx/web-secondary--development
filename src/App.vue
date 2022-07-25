<template>
  <div class="main">
    <div class="toolBox">
      <el-button type="primary" icon="el-icon-plus" size="small" @click="addSearch">添加查询条件</el-button>
      <el-button icon="el-icon-delete" size="small" @click="deleteRow">删除选中查询条件</el-button>
      <el-button icon="el-icon-refresh" size="small" @click="reStart">重置</el-button>
      <el-button icon="el-icon-search" size="small" @click="startSearch">查询</el-button>
    </div>
    <div class="seachList">
      <el-form :model="form" :rules="rules" ref="form">
        <el-table :data="form.tableData" style="width: 100%" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column align="center" prop="leftBracketsValue" label="左括号">
            <template slot-scope="scope">
              <el-form-item :prop="'tableData.' + scope.$index + '.leftBracketsValue'" :rules="rules.leftBracketsValue">
                <el-select filterable v-model="scope.row.leftBracketsValue" placeholder="请选择">
                  <el-option v-for="item in leftBracketsOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="searchFieldValue" label="查询字段">
            <template slot-scope="scope">
              <el-form-item :prop="'tableData.' + scope.$index + '.searchFieldValue'" :rules="rules.searchFieldValue">
                <el-select value-key="id" filterable v-model="scope.row.searchFieldValue" placeholder="请选择" @change="searchFieldChange($event, scope.$index)">
                  <el-option v-for="item in searchFieldOptions" :key="item.id" :label="item.data_value" :value="item"> </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="relationValue" label="关系">
            <template slot-scope="scope">
              <el-form-item :prop="'tableData.' + scope.$index + '.relationValue'" :rules="rules.relationValue">
                <el-select filterable v-model="scope.row.relationValue" placeholder="请选择" @change="relationValueChange($event, scope.$index)">
                  <el-option v-for="item in scope.row.relationOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="searchValue" label="查询值">
            <template slot-scope="scope">
              <!-- 输入 -->
              <el-form-item
                v-if="scope.row.showType == 3 && scope.row.relationValue !== 'is null' && scope.row.relationValue !== 'is not null'"
                :prop="'tableData.' + scope.$index + '.searchValue'"
                :rules="rules.searchValue"
              >
                <el-input v-model="scope.row.searchValue" placeholder="请输入"> </el-input>
              </el-form-item>
              <!-- 省市区 -->
              <el-form-item
                v-if="scope.row.showType == 5 && scope.row.relationValue !== 'is null' && scope.row.relationValue !== 'is not null'"
                :prop="'tableData.' + scope.$index + '.regionValue'"
                :rules="rules.regionValue"
              >
                <el-cascader size="large" :options="regionOptions" v-model="scope.row.regionValue" @change="regionChange"> </el-cascader>
              </el-form-item>
              <!-- 时间 -->
              <el-form-item
                v-if="scope.row.showType == 2 && scope.row.relationValue !== 'is null' && scope.row.relationValue !== 'is not null'"
                :prop="'tableData.' + scope.$index + '.dateValue'"
                :rules="rules.dateValue"
              >
                <el-date-picker style="width: 100%" value-format="yyyy-MM-dd HH:mm:ss" v-model="scope.row.dateValue" type="date" placeholder="选择日期"> </el-date-picker>
              </el-form-item>
              <!-- 选择 -->
              <el-form-item
                v-if="(scope.row.showType == 1 || scope.row.showType == 4) && scope.row.relationValue !== 'is null' && scope.row.relationValue !== 'is not null'"
                :prop="'tableData.' + scope.$index + '.searchSelectValue'"
                :rules="rules.searchSelectValue"
              >
                <el-select filterable v-model="scope.row.searchSelectValue" placeholder="请选择">
                  <el-option v-for="item in scope.row.searchSelectOptions" :key="item.data_code" :label="item.data_value" :value="item.data_code"> </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="rightBrackets" label="右括号">
            <template slot-scope="scope">
              <el-form-item :prop="'tableData.' + scope.$index + '.rightBracketsValue'" :rules="rules.rightBracketsValue">
                <el-select filterable v-model="scope.row.rightBracketsValue" placeholder="请选择">
                  <el-option v-for="item in RightBracketsOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="symbolValue" label="连接符">
            <template slot-scope="scope">
              <el-form-item :prop="'tableData.' + scope.$index + '.symbolValue'" :rules="rules.symbolValue">
                <el-select filterable v-model="scope.row.symbolValue" placeholder="请选择">
                  <el-option v-for="item in symbolOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column> </el-table
      ></el-form>
    </div>
    <div class="resultListToolBox">
      <MultipleSelect v-model="tableValue" :options="tableOptions" @receiveSelect="receiveSelect"></MultipleSelect>
      <el-button class="exportExcel" icon="el-icon-arrow-down" size="small" @click="exportExcel">导出</el-button>
    </div>
    <div class="resultList">
      <el-table
        :data="seachListData"
        :header-row-style="{ color: '#0c0d0e', fontSize: '12px', fontWeight: '600' }"
        :header-cell-style="{ background: '#FAFAFA' }"
        style="width: 100%"
        border
      >
        <template v-for="(item, index) in tableHead">
          <el-table-column
            show-overflow-tooltip="true"
            width="250px"
            sortable
            align="left"
            :prop="item.column_name"
            :label="item.column_comment"
            :key="index"
          ></el-table-column>
        </template>
        <el-table-column fixed="right" align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="goToInfo(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tatal"
      class="pagination"
    >
    </el-pagination>
  </div>
</template>

<script>
// import appService from "@njsdata/app-sdk";
import { regionData, CodeToText, TextToCode } from "element-china-area-data";
import MultipleSelect from "./components/multipleSelect";
import eventActionDefine from "./components/msgCompConfig";
import { queryColumns, queryResultList, queryExport } from "./api/asset";
import { ElMapExportTable } from "table-excel";
import "./index.css";
export default {
  name: "App",
  components: {
    MultipleSelect,
    ElMapExportTable,
  },
  data() {
    return {
      tableValue: [],
      // 地区选择器选项
      regionOptions: regionData,
      // 限制条件
      rules: {
        leftBracketsValue: [{ required: true, message: "请选择括号", trigger: "change" }],
        rightBracketsValue: [{ required: true, message: "请选择括号", trigger: "change" }],
        searchFieldValue: [{ required: true, message: "请选择查询字段", trigger: "change" }],
        relationValue: [{ required: true, message: "请选择关系", trigger: "change" }],
        symbolValue: [{ required: true, message: "请选择连接符", trigger: "change" }],
        dateValue: [{ required: true, message: "请选择日期", trigger: "change" }],
        regionValue: [{ required: true, message: "请选择省市区", trigger: "change" }],
        searchSelectValue: [{ required: true, message: "请选择", trigger: "change" }],
        searchValue: [{ required: true, message: "请输入查询值", trigger: "blur" }],
      },
      searchSelectOptions: [],
      // 表头选项
      tableOptions: [],
      // 表头数据
      tableHead: [],
      // 筛选出来的结果数据
      seachListData: [],
      // 选择条件数据
      form: {
        tableData: [],
      },
      // 选中的数据
      multipleSelection: [],
      // 括号选项
      leftBracketsOptions: [
        {
          value: "yes",
          label: "(",
        },
        {
          value: "no",
          label: " ",
        },
      ],
      RightBracketsOptions: [
        {
          value: "yes",
          label: ")",
        },
        {
          value: "no",
          label: " ",
        },
      ],
      // 查询字段选项
      searchFieldOptions: [
        {
          value: "enterpriseType",
          label: "企业类型",
        },
        {
          value: "industry",
          label: "所属行业",
        },
      ],
      // 关系选项
      relationOptions: [
        {
          value: "=",
          label: "等于",
        },
        {
          value: "!=",
          label: "不等于",
        },
        {
          value: ">",
          label: "大于",
        },
        {
          value: "<",
          label: "小于",
        },
        {
          value: ">=",
          label: "大于等于",
        },
        {
          value: "<=",
          label: "小于等于",
        },
        {
          value: "contain",
          label: "包含",
        },
        {
          value: "noContain",
          label: "不包含",
        },
        {
          value: "is null",
          label: "为空",
        },
        {
          value: "is not null",
          label: "不为空",
        },
      ],
      // 连接符选项
      symbolOptions: [
        {
          value: "and",
          label: "并且",
        },
        {
          value: "or",
          label: "或者",
        },
      ],
      // 注入唯一标识
      listId: 0,
      // 分页参数
      tatal: 0,
      limit: 10,
      page: 1,
      queryMessage: "",
    };
  },
  props: {
    customConfig: Object,
    info: Object,
  },
  computed: {},
  mounted() {
    let { componentId } = this.customConfig || {};
    componentId && window.componentCenter?.register(componentId, "comp", this, eventActionDefine);
    this.tatal = this.seachListData.length;
    queryColumns().then((res) => {
      this.searchFieldOptions = res.data;
      this.searchFieldOptions.forEach((item, index) => {
        let message = {
          column_name: item.data_code.replace(/(\s*$)/g, ""),
          column_comment: item.data_value,
        };
        let message2 = {
          value: item.data_code.replace(/(\s*$)/g, ""),
          label: item.data_value,
        };
        this.tableHead.push(message);
        this.tableOptions.push(message2);
      });
    });
  },
  methods: {
    // 省市区选择器change
    regionChange(value) {
      console.log(this.form.tableData);
      this.getCodeToText(null, value);
    },
    // 省市区选择器解码
    getCodeToText(codeStr, codeArray) {
      if (null === codeStr && null === codeArray) {
        return null;
      } else if (null === codeArray) {
        codeArray = codeStr.split(",");
      }
      let area = "";
      switch (codeArray.length) {
        case 1:
          area += CodeToText[codeArray[0]];
          break;
        case 2:
          area += CodeToText[codeArray[0]] + "/" + CodeToText[codeArray[1]];
          break;
        case 3:
          area += CodeToText[codeArray[0]] + "/" + CodeToText[codeArray[1]] + "/" + CodeToText[codeArray[2]];
          break;
        default:
          break;
      }
      console.log(area);
      return area;
    },
    relationValueChange(row, index) {
      if (row == "is null" || row == "is not null") {
        this.form.tableData[index].regionValue = "";
        this.form.tableData[index].searchSelectValue = "";
        this.form.tableData[index].dateValue = "";
        this.form.tableData[index].searchValue = "";
      }
    },
    searchFieldChange(data, index) {
      this.form.tableData[index].regionValue = "";
      this.form.tableData[index].relationValue = "";
      this.form.tableData[index].searchSelectValue = "";
      this.form.tableData[index].searchSelectOptions = [];
      this.form.tableData[index].dateValue = "";
      this.form.tableData[index].searchValue = "";
      if (data.is_compare == 1) {
        this.form.tableData[index].relationOptions = [
          {
            value: "=",
            label: "等于",
          },
          {
            value: "!=",
            label: "不等于",
          },
          {
            value: "contain",
            label: "包含",
          },
          {
            value: "noContain",
            label: "不包含",
          },
          {
            value: "is null",
            label: "为空",
          },
          {
            value: "is not null",
            label: "不为空",
          },
        ];
      } else {
        this.form.tableData[index].relationOptions = [
          {
            value: "=",
            label: "等于",
          },
          {
            value: "!=",
            label: "不等于",
          },
          {
            value: ">",
            label: "大于",
          },
          {
            value: "<",
            label: "小于",
          },
          {
            value: ">=",
            label: "大于等于",
          },
          {
            value: "<=",
            label: "小于等于",
          },
          {
            value: "contain",
            label: "包含",
          },
          {
            value: "noContain",
            label: "不包含",
          },
          {
            value: "is null",
            label: "为空",
          },
          {
            value: "is not null",
            label: "不为空",
          },
        ];
      }
      let message = {
        pid: data.id,
      };
      this.form.tableData[index].showType = data.type;
      queryColumns(message).then((res) => {
        if (data.type == 1) {
          this.form.tableData[index].searchSelectOptions = res.data;
        }
        if (data.type == 4) {
          this.form.tableData[index].searchSelectOptions = [
            {
              data_value: "是",
              data_code: "0",
            },
            {
              data_value: "否",
              data_code: "1",
            },
          ];
        }
        console.log(this.form, data);
      });
    },
    goToInfo(row) {
      window.open(
        `${window.location.origin}/applicationview/content/view?appid=12de72ad-5a3e-97dc-eb98-b3e6e7cf0578&type=view&menuId=bc84d5cc-94a6-2992-d8bb-aa5e436ccc04&pId=0c340911-9608-1ea8-7e5d-58c4ba20c4dc&tyshxydm=${row.tyshxydm}`,
        "_blank"
      );
    },
    // 选择条件多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 新增搜索条件
    addSearch() {
      let message = {
        leftBracketsValue: "",
        rightBracketsValue: "",
        searchFieldValue: "",
        relationValue: "",
        searchValue: "",
        symbolValue: "",
        regionValue: "",
        dateValue: "",
        searchSelectOptions: "",
        searchSelectValue: "",
        relationOptions: [],
        listId: this.listId++,
      };
      this.form.tableData.push(message);
    },
    // 重置
    reStart() {
      this.form.tableData = [];
      this.queryMessage = "";
      this.multipleSelection = [];
      this.seachListData = [];
    },
    // 删除行
    deleteRow() {
      this.multipleSelection.forEach((item, index) => {
        this.form.tableData.forEach((tableItem, tableIndex) => {
          if (tableItem.listId == item.listId) {
            this.form.tableData.splice(tableIndex, 1);
            tableIndex--;
          }
        });
      });
    },
    is_leagl_brackets(string) {
      var array = [];
      for (var i = 0; i < string.length; i++) {
        var item = string[i];
        if (item === "(") {
          array.push("(");
        } else if (item === ")") {
          if (array.length === 0) {
            return false;
          } else {
            array.pop();
          }
        } else {
          continue;
        }
      }
      return array.length === 0;
    },
    // 查询
    startSearch() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let message = "";
          this.form.tableData.forEach((item, index) => {
            console.log(item);
            let leftBracketsValue = item.leftBracketsValue == "yes" ? "(" : "";
            let rightBracketsValue = item.rightBracketsValue == "yes" ? ")" : "";
            let searchFieldValue = `${item.searchFieldValue.data_code.replace(/(\s*$)/g, "")}`;
            let relationValue = `${item.relationValue}`;
            let searchValue = "";
            switch (item.showType) {
              case 1:
                searchValue = `${item.searchSelectValue}`;
                break;
              case 2:
                searchValue = `${item.dateValue}`;
                break;
              case 3:
                searchValue = `${item.searchValue}`;
                break;
              case 4:
                searchValue = `${item.searchSelectValue}`;
                break;
              case 5:
                searchValue = `${item.regionValue[2]}`;
                break;
              default:
            }
            if (item.relationValue == "is null" || item.relationValue == "is not null") {
              searchValue = `${searchValue}`;
            } else {
              searchValue = `'${searchValue}'`;
            }
            let symbolValue = "";
            if (index == this.form.tableData.length - 1) {
              symbolValue = ``;
            } else {
              symbolValue = `${item.symbolValue}`;
            }
            if (relationValue == "contain") {
              message += `${leftBracketsValue} ${searchFieldValue} like concat('%', ${searchValue}, '%') ${rightBracketsValue} ${symbolValue} `;
            } else if (relationValue == "noContain") {
              message += `${leftBracketsValue} ${searchFieldValue} not like concat('%', ${searchValue}, '%') ${rightBracketsValue} ${symbolValue} `;
            } else {
              message += `${leftBracketsValue} ${searchFieldValue} ${relationValue} ${searchValue} ${rightBracketsValue} ${symbolValue} `;
            }
          });
          this.queryMessage = message.replace(/(\s*$)/g, "");
          console.log(this.is_leagl_brackets(this.queryMessage));
          this.queryResult();
        }
      });
    },
    queryResult() {
      if (this.is_leagl_brackets(this.queryMessage)) {
        let query = {
          tableHead: [],
        };
        this.tableHead.forEach((item, index) => {
          query.tableHead.push(item.column_name);
        });
        console.log(this.queryMessage);
        queryResultList(query, this.queryMessage, this.limit, this.page).then((res) => {
          this.$message({
            message: "查询成功!",
            type: "success",
          });
          this.seachListData = res.data.data;
          this.tatal = res.data.total;
          console.log(this.tatal);
        });
        // .catch((error) => {
        //   this.$message.error(error.message);
        // });
      } else {
        return this.$message.error("请检查括号是否成对");
      }
    },
    convertTime(date) {
      let Time = new Date(date);
      let year = Time.getFullYear();
      let month = Time.getMonth();
      let day = Time.getDay();
      return year + "-" + month + "-" + day;
    },
    // 动态表头选择change
    receiveSelect(val) {
      this.tableHead = [];
      val.forEach((item, index) => {
        let message = {
          column_name: item.value,
          column_comment: item.label,
        };
        this.tableHead.push(message);
      });
      console.log(this.tableHead);
    },
    exportExcel() {
      let query = {
        tableHead: [],
      };
      this.tableHead.forEach((item, index) => {
        query.tableHead.push(item.column_name);
      });
      queryResultList(query, "", 1000000, 1).then((res) => {
        let column = [];
        this.tableHead.forEach((item, index) => {
          let message = {
            title: item.column_comment,
            dataIndex: item.column_name,
          };
          column.push(message);
        });
        let data = res.data.data;
        const instance = new ElMapExportTable(
          { column, data },
          { progress: (progress) => true } // 进度条回调
        );
        instance.download("结果excel");
      });
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.limit = val;
      this.queryResult();
    },
    handleCurrentChange(val) {
      this.page = val;
      console.log(`当前页: ${val}`);
      this.queryResult();
    },
    // 具体分页操作
    pageList() {
      this.stationData = this.stationList.filter((item, index) => index < this.page * this.limit && index >= this.limit * (this.page - 1));
      this.total = this.stationData.length;
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
.seachList {
  margin-top: 10px;
  /deep/.el-table__body-wrapper {
    .el-table__cell {
      padding-bottom: 0 !important;
    }
    .el-form-item {
      margin-top: 6px;
      margin-bottom: 18px;
    }
    .el-form-item__error {
      margin-top: 0px;
    }
  }
}
.resultList {
  margin-top: 10px;
  /deep/.el-table__header tr,
  /deep/ .el-table__header th {
    padding: 0;
    height: 37px;
    line-height: 37px;
  }
  /deep/.el-table__cell .cell{
    display: flex;
    justify-content: space-between;
    line-height: 37px;
  }
  /deep/.el-table .caret-wrapper{
    margin-top: 3px;
  }
  /deep/.el-table__body tr,
  /deep/.el-table__body td {
    padding: 0;
    height: 37px;
  }
}
.resultListToolBox {
  margin-top: 20px;
}
.pagination {
  display: flex;
  justify-content: end;
  margin-top: 10px;
  margin-bottom: 10px;
}
.exportExcel {
  margin-left: 10px;
}
.el-button--primary {
  background-color: #0454f2;
  border-color: #0454f2;
}
</style>
