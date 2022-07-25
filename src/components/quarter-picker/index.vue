<template>
  <el-popover trigger="focus" v-model="pickerVisible" popper-class="lervor-quarter-popover" :disabled="disabled">
    <el-input
      ref="reference"
      slot="reference"
      class="el-date-editor"
      readonly
      :disabled="disabled"
      :size="size"
      :placeholder="placeholder"
      :value="displayValue"
      :validate-event="false"
      :style="{ width }"
      @mouseenter.native="handleMouseEnter"
      @mouseleave.native="showClose = false"
    >
      <i slot="prefix" class="el-input__icon" :class="triggerClass"> </i>
      <i slot="suffix" class="el-input__icon" :class="[showClose ? '' + clearIcon : '']" @click="handleClickIcon" @mousedown="handleMousedownIcon"> </i>
    </el-input>
    <div class="lervor-quarter-picker">
      <div class="el-date-picker__header el-date-picker__header--bordered">
        <button type="button" aria-label="前一年" class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left" @click="prevYear"></button>
        <span role="button" class="el-date-picker__header-label">{{ yearLabel }}</span>
        <button type="button" aria-label="后一年" class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right" @click="nextYear"></button>
      </div>
      <div class="el-picker-panel__content" style="width: 200px; margin: 10px 15px">
        <table class="lervor-quarter-table" @click="handleTableClick">
          <tbody>
            <tr>
              <td class="available" :class="getCellStyle(0)">
                <a class="cell">第一季度</a>
              </td>
              <td class="available" :class="getCellStyle(1)">
                <a class="cell">第二季度</a>
              </td>
            </tr>
            <tr>
              <td class="available" :class="getCellStyle(2)">
                <a class="cell">第三季度</a>
              </td>
              <td class="available" :class="getCellStyle(3)">
                <a class="cell">第四季度</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </el-popover>
</template>

<script>
import { formatDate, prevYear, nextYear, range, nextDate, isDateObject, parseDate } from "element-ui/src/utils/date-util";
import { hasClass } from "element-ui/src/utils/dom";

// 获取指定年份和季度的所有日期
const datesInYearAndQuarter = (year, quarter) => {
  const numOfDays = getDayCountOfQuarter(year, quarter);
  const firstDay = new Date(year, quarter * 3, 1);
  return range(numOfDays).map((n) => nextDate(firstDay, n));
};

// 获取指定年份和季度总天数
const getDayCountOfQuarter = (year, quarter) => {
  switch (quarter) {
    case 0: // 第一季度包含二月，需要对是否闰年进行判断处理
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        return 91;
      } else {
        return 90;
      }
    case 1:
      return 91;
    default:
      return 92;
  }
};

export default {
  name: "QuarterPicker",
  props: {
    size: String,
    format: String, // 显示在输入框中的格式，引入季度：q（阿拉伯数字）、Q（中文数字）
    valueFormat: String,
    placeholder: String,
    prefixIcon: String,
    clearIcon: {
      type: String,
      default: "el-icon-circle-close",
    },
    disabled: Boolean,
    clearable: {
      type: Boolean,
      default: true,
    },
    width: {
      // 组件宽度
      type: String,
      default: "",
    },
    disabledDate: {}, // 不可用的日期
    value: null,
  },
  data() {
    return {
      showClose: false,
      pickerVisible: false,
      date: new Date(),
      quarterText: ["一", "二", "三", "四"],
    };
  },
  computed: {
    triggerClass() {
      return this.prefixIcon || "el-icon-date";
    },
    displayValue() {
      if (!this.value) return null;
      // 季度，从0开始
      const quarter = parseInt(this.parsedValue.getMonth() / 3);
      let fDate = formatDate(this.parsedValue, this.format);
      fDate = fDate.replace(/q/, quarter + 1).replace(/Q/, this.quarterText[quarter]);
      return fDate;
    },
    year() {
      return this.date.getFullYear();
    },
    yearLabel() {
      return this.year + " 年";
    },
    parsedValue() {
      if (!this.value) {
        return this.value;
      }
      if (isDateObject(this.value)) {
        return this.value;
      }
      // 非时间格式且设置了valueFormat，进行时间转换
      if (this.valueFormat) {
        return parseDate(this.value, this.valueFormat);
      }
      // 非时间格式且未设置valueFormat，再尝试转换时间
      return new Date(this.value);
    },
  },
  watch: {
    value(value) {
      this.date = value ? this.parsedValue : new Date();
    },
  },
  methods: {
    handleMouseEnter() {
      if (this.disabled) return;
      if (this.value && this.clearable) {
        this.showClose = true;
      }
    },
    handleClickIcon(event) {
      if (this.disabled) return;
      if (this.showClose) {
        this.$emit("input", null);
        this.$emit("change", null);
        this.showClose = false;
        this.pickerVisible = false;
        this.$refs.reference.blur();
      }
    },
    handleMousedownIcon(event) {
      // 阻止鼠标按下清空按钮，防止清空数据时季度选择面板闪现
      event.preventDefault();
    },
    handleTableClick(event) {
      let target = event.target;
      if (target.tagName === "A") {
        target = target.parentNode;
      }
      if (target.tagName !== "TD") return;
      if (hasClass(target, "disabled")) return;
      const column = target.cellIndex;
      const row = target.parentNode.rowIndex;
      // 季度，从0开始
      const quarter = row * 2 + column;
      // 季度开始月份，从0开始
      const month = quarter * 3;
      let newDate = new Date(this.year, month, 1);
      if (this.valueFormat) {
        newDate = formatDate(newDate, this.valueFormat);
      }
      this.pickerVisible = false;
      this.$emit("input", newDate);
      this.$emit("change", [newDate,this.getEndDate(month)]);
    },
    getEndDate(month) {
      let endDate = new Date(this.year, month + 3, 1); // 取当年当月中的第一天
      console.log(endDate);
      let lastDay = new Date(endDate.getTime() - 1000 * 60 * 60 * 24).getDate(); // 获取当月最后一天日期
      let mon = "";
      if (endDate.getMonth() < 10 && endDate.getMonth() !== 0) {
        mon = "0" + endDate.getMonth();
      } else if (endDate.getMonth() == 0) {
        mon = 12;
      } else {
        mon = endDate.getMonth();
      }
      return this.year + "-" + mon + "-" + lastDay;
    },
    prevYear() {
      this.date = prevYear(this.date);
    },
    nextYear() {
      this.date = nextYear(this.date);
    },
    getCellStyle(quarter) {
      const style = {};
      const today = new Date();
      const date = this.parsedValue ? this.parsedValue : today;
      style.disabled = typeof this.disabledDate === "function" ? datesInYearAndQuarter(this.year, quarter).every(this.disabledDate) : false;
      // 当前选中的季度样式
      style.current = date.getFullYear() === this.year && parseInt(date.getMonth() / 3) === quarter;
      // 今日所在季度样式
      style.quarter = today.getFullYear() === this.year && parseInt(today.getMonth() / 3) === quarter;
      return style;
    },
  },
};
</script>

<style>
.lervor-quarter-picker {
  line-height: 30px;
}
.lervor-quarter-popover {
  padding: 0;
}
.lervor-quarter-table {
  font-size: 12px;
  margin: -1px;
  border-collapse: collapse;
  width: 100%;
}
.lervor-quarter-table td {
  text-align: center;
  padding: 10px 3px;
  cursor: pointer;
}
.lervor-quarter-table td .cell {
  height: 32px;
  display: block;
  line-height: 32px;
  color: #606266;
  margin: 0 auto;
}
.lervor-quarter-table td .cell:hover {
  color: #1890ff;
}

.lervor-quarter-table td.current:not(.disabled) .cell {
  color: #409eff;
}

.lervor-quarter-table td.quarter .cell {
  color: #409eff;
  font-weight: 700;
}

.lervor-quarter-table td.disabled .cell {
  background-color: #f5f7fa;
  cursor: not-allowed;
  color: #c0c4cc;
}
</style>
