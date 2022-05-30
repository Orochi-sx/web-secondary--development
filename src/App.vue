<template>
  <div class="main">
    <div class="chooseAll" :style="{ height: chooseAllHeight }">
      <div class="choose" v-for="(item, index) of infoDate" :key="index">
        <!-- 筛选列表标题 -->
        <p>{{ item.title }}</p>
        <!-- 不限选择  -->
        <el-radio-group
          size="mini"
          @change="noLimitClick(index)"
          v-model="noLimit[index]"
        >
          <el-radio-button label="不限"></el-radio-button>
        </el-radio-group>
        <!-- 多选筛选 -->
        <el-checkbox-group
          v-if="item.multipleList"
          v-model="form.radioArray[index]"
          size="mini"
          @change="checkboxChange($event, index)"
        >
          <el-checkbox-button
            v-for="itemSon of item.multipleList"
            :key="itemSon.key"
            :label="itemSon"
            >{{ itemSon.label }}</el-checkbox-button
          >
        </el-checkbox-group>
        <!-- 单选筛选 -->
        <el-radio-group
          v-else
          size="mini"
          @change="radioChange($event, index)"
          v-model="form.radioArray[index]"
        >
          <el-radio-button
            v-for="itemSon of item.singleList"
            :key="itemSon.key"
            :label="itemSon"
            >{{ itemSon.label }}</el-radio-button
          >
          <el-radio-button
            v-if="item.shortcutTime"
            :label="shortcutDate[0]"
            :key="shortcutDate[0].key"
            >{{ shortcutDate[0].label }}</el-radio-button
          >
          <el-radio-button
            v-if="item.shortcutTime"
            :label="shortcutDate[1]"
            :key="shortcutDate[1].key"
            >{{ shortcutDate[1].label }}</el-radio-button
          >
          <el-radio-button
            v-if="item.shortcutTime"
            :label="shortcutDate[2]"
            :key="shortcutDate[2].key"
            >{{ shortcutDate[2].label }}</el-radio-button
          ></el-radio-group
        >
        <!-- 日期筛选 -->
        <el-date-picker
          v-if="item.extra == 'date'"
          v-model="dateModel[index]"
          size="mini"
          @change="dateChange(index)"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="expireTimeOPtion"
        >
        </el-date-picker>
        <!-- 输入框 -->
        <el-input
          v-model="inputDate[index]"
          @keyup.enter.native="enterClick(index)"
          :placeholder="item.placeholder"
          v-else-if="item.extra == 'input'"
        />
        <!-- 搜索选择 -->
        <el-select
          collapse-tags
          filterable
          v-else-if="item.extra == 'select'"
          size="mini"
          v-model="selectDate[index]"
          multiple
          value-key="key"
          @change="selectChange($event, index)"
          :placeholder="item.placeholder"
        >
          <el-option
            v-for="item in options[index]"
            :key="item.key"
            :label="item.label"
            :value="item"
          >
          </el-option>
        </el-select>
        <!-- <p v-show="lineShow[index]" @click="lineShowClick(index)">展开</p>
        <p v-show="!lineShow[index]" @click="lineShowClick(index)">收起</p> -->
      </div>
      <div class="choose" v-show="selectedShow">
        <p>已选条件</p>
        <template v-for="(item, index) of form.radioArray">
          <el-tag
            v-if="!Array.isArray(item)"
            size="mini"
            effect="plain"
            @close="closeTag(item, null, index)"
            closable
            >{{ item.label }}</el-tag
          >
          <template v-else-if="Array.isArray(item)">
            <el-tag
              size="mini"
              effect="plain"
              v-for="(item2, index2) of item"
              :key="index2"
              @close="closeTag(item2, index2, index)"
              closable
              >{{ item2.label }}</el-tag
            >
            <el-tag
              size="mini"
              effect="plain"
              v-for="(itemSelect, indexSelect) of selectDate[index]"
              :key="indexSelect"
              @close="closeTagSelect(itemSelect, indexSelect, index)"
              closable
              >{{ itemSelect.label }}</el-tag
            >
          </template>
        </template>
        <el-button
          v-show="selectedShow"
          class="button-new-tag"
          size="mini"
          @click="cleanAll"
          >清除全部</el-button
        >
      </div>
    </div>
    <div class="tool">
      <el-input placeholder="项目名" v-model="input" clearable>
        <i slot="suffix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button v-show="!openFlag" @click="openOff">展开筛选</el-button>
      <el-button v-show="openFlag" @click="openOff">收起筛选</el-button>
    </div>
  </div>
</template>

<script>
// import appService from "@njsdata/app-sdk";
import eventActionDefine from "./components/msgCompConfig";
import { formateDate } from "./date";
import { queryAssetById } from "./api/asset";
import "./index.css";
import { json } from "body-parser";
export default {
  name: "App",
  props: {
    customConfig: Object,
    info: Object,
  },
  data() {
    return {
      input: null,
      input2: null,
      openFlag: true,
      activeName: "first",
      radio1: "1",
      radio2: "1",
      radio3: "1",
      chooseAllHeight: "",
      startsheight: "",
      value1: "",
      noLimit: [],
      dateModel: [],
      isChooseDate: [],
      inputDate: [],
      selectDate: [],
      shortcutTimeDate: [],
      shortcutDate: [
        {
          label: "3个月前",
          key: "3个月前",
        },
        {
          label: "6个月前",
          key: "6个月前",
        },
        {
          label: "一年前",
          key: "一年前",
        },
      ],
      tagArray: ["快速入门篇", "基础配置篇", "进阶设计篇", "业务场景篇"],
      requestMessage: {},
      options: [],
      nowDate: "",
      form: {
        radioArray: [],
      },
      expireTimeOPtion: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e6就是不可以选择今天的
        },
      },
      lineShow: [],
      selectedShow: false,
      assetMessage: [],
      infoDate: [],
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
  created() {
    this.customConfig.chooseList = JSON.parse(this.customConfig.chooseList);
    console.log(this.customConfig.chooseList);
    queryAssetById(this.customConfig.assetId).then((res) => {
      this.assetMessage = this.handleAsset(res.data);
      this.handlePlatform();
      this.customConfig.chooseList.forEach((e, index) => {
        this.form.radioArray[index] = [];
        this.selectDate[index] = [];
        this.isChooseDate[index] = {};
        this.inputDate[index] = "";
        this.noLimit[index] = "不限";
        this.lineShow[index] = true;
        if (e.options) {
          this.options[index] = e.options;
        } else {
          this.options[index] = [];
        }
      });
      let date = new Date();
      this.nowDate = formateDate(date, "yyyy-MM-dd");
    });
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
    // this.$nextTick(() => {
    //   this.startsheight = this.$el.children[0].offsetHeight;
    //   console.log(
    //     this,
    //     document.getElementsByClassName("chooseAll")[0].offsetHeight,
    //     this.startsheight
    //   );
    // });
  },
  methods: {
    handleAsset(data) {
      let messageAll = [];
      data[0].forEach((item, index) => {
        let message = {};
        message.title = item.col_name;
        let info = [];
        data[1].forEach((item2, index2) => {
          info.push(item2[index]);
        });
        message.list = [...new Set(info)];
        messageAll.push(message);
      });
      messageAll.forEach((item, index) => {
        let messageAll2 = [];
        item.list.forEach((item2, index2) => {
          let labelKey = {
            label: item2,
            key: item2,
          };
          messageAll2.push(labelKey);
          messageAll[index].list = messageAll2;
        });
      });
      console.log(messageAll);
      return messageAll;
    },
    handlePlatform() {
      this.customConfig.chooseList.forEach((item, index) => {
        this.assetMessage.forEach((item2, index2) => {
          if (item.title == item2.title) {
            if (item.singleOrMutiple == "single") {
              item.singleList = item2.list;
            } else if (item.singleOrMutiple == "mutiple") {
              item.multipleList = item2.list;
            }
          }
        });
      });
      this.infoDate = this.customConfig.chooseList;
    },
    // 整个收起隐藏
    openOff() {
      if (!this.startsheight) {
        this.startsheight = this.$el.children[0].offsetHeight;
      }
      this.openFlag = !this.openFlag;
      if (this.selectedShow) {
      }
      this.chooseAllHeight = this.openFlag
        ? this.startsheight + 28 + "px"
        : "30px";
      console.log(this.chooseAllHeight);
    },
    // 行内显示隐藏
    lineShowClick(index) {
      console.log(index);
      this.lineShow[index] = !this.lineShow[index];
      console.log(index);
    },
    // 多选事件
    checkboxChange(e, index) {
      if (this.isChooseDate[index].dateFlag) {
        this.$set(this.form.radioArray, index, []);
        this.$set(this.form.radioArray, index, [e[e.length - 1]]);
      }
      this.$set(this.dateModel, [index], []);
      if (typeof this.noLimit[index] == "string") {
        this.$set(this.noLimit, index, "");
      }
      this.isChooseDate[index].dateFlag = false;
      this.setRequestMessage();
      console.log(this.form.radioArray);
    },
    // 单选事件
    radioChange(val, index) {
      this.$set(this.dateModel, [index], []);
      this.$set(this.shortcutTimeDate, index, "");
      this.$set(this.selectDate, index, []);
      if (typeof this.noLimit[index] == "string") {
        this.$set(this.noLimit, index, "");
      }
      this.setRequestMessage();
    },
    // 不限事件
    noLimitClick(index) {
      this.$set(this.form.radioArray, [index], []);
      this.$set(this.selectDate, [index], []);
      this.$set(this.dateModel, [index], []);
      this.setRequestMessage();
    },
    // 日期事件
    dateChange(index) {
      this.isChooseDate[index].dateFlag = true;
      this.$set(
        this.form.radioArray,
        [index],
        [
          {
            key: this.dateModel[index][0] + "|" + this.dateModel[index][1],
            label: this.dateModel[index][0] + "|" + this.dateModel[index][1],
          },
        ]
      );
      if (typeof this.noLimit[index] == "string") {
        this.$set(this.noLimit, index, "");
      }
      this.setRequestMessage();
    },
    // 普通标签关闭事件
    closeTag(item, index2, index) {
      console.log(item, index2, index);
      if (!Array.isArray(this.form.radioArray[index])) {
        this.$set(this.form.radioArray, [index], []);
      } else {
        this.form.radioArray[index].splice(index2, 1);
      }
      this.$set(this.dateModel, [index], []);
      this.setRequestMessage();
    },
    // 选择器标签关闭事件
    closeTagSelect(itemSelect, indexSelect, index) {
      this.selectDate[index].splice(indexSelect, 1);
      this.setRequestMessage();
    },
    // 输入框回车事件
    enterClick(index) {
      let message = {
        key: this.inputDate[index],
        label: this.inputDate[index],
      };
      this.form.radioArray[index].push(message);
      this.$set(this.inputDate, [index], "");
      this.setRequestMessage();
    },
    // 选择器事件
    selectChange(value, index) {
      if (this.infoDate[index].singleList) {
        this.$set(this.form.radioArray, [index], {});
      }
      this.setRequestMessage();
    },
    cleanAll() {
      this.infoDate.forEach((e, index) => {
        this.$set(this.form.radioArray, [index], []);
        this.$set(this.isChooseDate, [index], {});
        this.$set(this.inputDate, [index], "");
        this.$set(this.dateModel, [index], []);
        this.$set(this.selectDate, [index], []);
        this.$set(this.noLimit, [index], "不限");
        this.lineShow[index] = true;
      });
      for (var key in this.requestMessage) {
        this.requestMessage[key] = "";
      }
      console.log(this.form.radioArray);
    },
    // 快捷时间选中事件
    // shortcutTimeChange(index) {
    //   console.log();
    //   if (Array.isArray(this.form.radioArray[index])) {
    //     this.$set(this.form.radioArray, [index], []);
    //   } else {
    //     this.$set(this.form.radioArray, [index], {});
    //   }
    //   console.log(index, this.shortcutTimeDate);
    //   this.setRequestMessage();
    // },
    // 设置请求
    setRequestMessage() {
      console.log(this.infoDate);
      this.infoDate.forEach((item, index) => {
        if (Array.isArray(this.form.radioArray[index])) {
          let message = "";
          this.form.radioArray[index].forEach((item2, index2) => {
            console.log(item2, index2, 443);
            if (index2 > 0) {
              message += "|" + item2.key;
            } else {
              message = item2.key;
            }
          });
          this.$set(this.requestMessage, item.fieldName, message);
        } else {
          if (this.form.radioArray[index].label == "3个月前") {
            let date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 90);
            this.$set(
              this.requestMessage,
              item.fieldName,
              formateDate(date, "yyyy-MM-dd") + "|" + this.nowDate
            );
          } else if (this.form.radioArray[index].label == "6个月前") {
            let date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 180);
            this.$set(
              this.requestMessage,
              item.fieldName,
              formateDate(date, "yyyy-MM-dd") + "|" + this.nowDate
            );
          } else if (this.form.radioArray[index].label == "1年前") {
            let date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 365);
            this.$set(
              this.requestMessage,
              item.fieldName,
              formateDate(date, "yyyy-MM-dd") + "|" + this.nowDate
            );
          } else {
            this.$set(
              this.requestMessage,
              item.fieldName,
              this.form.radioArray[index].key
            );
          }
        }
      });
      this.selectDate.forEach((item2, index2) => {
        if (this.requestMessage[this.infoDate[index2].fieldName].length > 0) {
          item2.forEach((item3, index3) => {
            this.requestMessage[this.infoDate[index2].fieldName] =
              this.requestMessage[this.infoDate[index2].fieldName] +
              "|" +
              item3.key;
          });
        } else {
          let message = "";
          item2.forEach((item4, index4) => {
            if (index4 > 0) {
              message += "|" + item4.key;
            } else {
              message = item4.key;
            }
            this.requestMessage[this.infoDate[index2].fieldName] = message;
          });
        }
      });
      console.log(this.requestMessage);
    },
  },
  destroyed() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  },
  watch: {
    requestMessage: {
      //深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        for (var key in val) {
          if (val[key]) {
            return (this.selectedShow = true);
          } else {
            this.selectedShow = false;
          }
        }
      },
      deep: true,
    },
  },
};
</script>
<style lang="less" scoped>
.main {
  display: flex;
  justify-content: space-between;
}
.title {
  width: 50px;
  height: 30px;
  color: #409eff;
  border-bottom: #409eff 4px solid;
}
/deep/.el-tabs__active-bar {
  height: 4px;
  width: 30px !important;
  transform: translateX(10px) !important;
}
/deep/.el-radio-button {
  // width: 100px;
  margin-right: 5px;
  border: 0px;
  margin-bottom: 5px;
}
/deep/.el-radio-button:focus:not(.is-focus):not(:active):not(.is-disabled) {
  box-shadow: 0 0 0 0;
}
/deep/.el-checkbox-button {
  margin-right: 5px;
  margin-bottom: 5px;
}
/deep/.el-radio-button__inner {
  border: 0px;
}
/deep/.el-checkbox-button__inner {
  border: 1px solid #dcdfe6;
  border-radius: 2px;
}
/deep/.el-date-editor--daterange.el-input__inner {
  width: 250px;
}
/deep/.el-input {
  width: 180px;
  .el-input__inner {
    height: 28px;
  }
}
/deep/.el-select {
  height: 28px;
}
/deep/.el-checkbox-button:first-child .el-checkbox-button__inner,
/deep/.el-checkbox-button:last-child .el-checkbox-button__inner {
  border-radius: 2px;
}
/deep/.el-checkbox-button.is-checked .el-checkbox-button__inner {
  background-color: #006eda;
  border: 0px;
}
/deep/.el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background-color: #006eda;
  border: 0px;
}
/deep/.el-checkbox-button--mini .el-checkbox-button__inner {
  padding: 5px 10px;
}
/deep/.el-radio-button--mini .el-radio-button__inner {
  padding: 5px 10px;
  background: transparent;
}
/deep/ .el-radio-button:last-child .el-radio-button__inner,
/deep/ .el-radio-button:first-child .el-radio-button__inner,
/deep/.el-radio-button__inner {
  border-radius: 2px;
}
/deep/.el-radio-button:first-child .el-radio-button__inner {
  border: 0px;
}
/deep/.el-tag {
  margin-right: 5px;
  border-radius: 2px;
}
/deep/.el-button {
  height: 28px;
  line-height: 0;
  margin-left: 10px;
}
/deep/.el-input__icon {
  height: 28px;
}
/deep/.el-input__suffix {
  top: -5px;
}
.choose {
  display: flex;
  justify-content: flex-start;
  margin-top: 2px;
  p {
    line-height: 22px;
    font-size: 14px;
    min-width: 100px;
  }
  /deep/.el-button {
    height: 20px;
  }
}
.chooseAll {
  width: 1500px;
  overflow: hidden;
  margin-top: 30px;
}
.tool {
  display: flex;
}
</style>