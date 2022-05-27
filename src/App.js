import React, { Component } from "react";
import { Table, Button, message } from "antd";
import "./app.less";
import * as echarts from "echarts";
const events = [
  {
    key: "onClick",
    name: "点击",
    payload: [
      {
        name: "名称",
        dataType: "string",
        key: "name",
      },
    ],
  },
];

const actions = [
  {
    key: "messageSuccess",
    name: "成功提示",
    params: [
      {
        key: "value",
        name: "值",
        dataType: "string",
      },
    ],
  },
];

export default class App extends Component {
  state = {
    barColor: null,
    lineColor: null,
    tipLineFontSize: null,
  };
  divRef = null;
  fnref = (el) => {
    this.divRef = el;
  };
  constructor(props) {
    super(props);
    const { pubSub } = props;
    pubSub?.subscribe &&
      pubSub.subscribe("analyzeDataSource", (data) => {
        this.loadTableFromData && this.loadTableFromData(data);
      });
    if (props.options.externalVariables) {
      this.barColor = props.options.externalVariables.barColor;
      this.lineColor = props.options.externalVariables.lineColor;
      this.markingTextSize = props.options.externalVariables.markingTextSize;
      this.markingPosition = props.options.externalVariables.markingPosition;
      this.markingText = props.options.externalVariables.markingText;
      this.titleText = props.options.externalVariables.titleText;
      this.titlePosition = props.options.externalVariables.titlePosition;
    }
  }
  initEcharts(data) {
    let echartsXdate = [];
    let echartsYdate = [];
    data.forEach((item, index) => {
      if (index > 0) {
        echartsXdate.push(item[0]);
        echartsYdate.push(parseInt(item[1]));
      }
    });
    const arrx = [...echartsXdate];
    const arry = [...echartsYdate];
    // 排序
    let b = 0; //设置用来调换位置的值
    let c = 0;
    // 冒泡 从大到小排序  同时  x轴信息也同时排序
    for (let i = 0; i < arry.length; i++) {
      for (let j = 0; j < arry.length; j++) {
        if (arry[j] < arry[j + 1]) {
          b = arry[j];
          arry[j] = arry[j + 1];
          arry[j + 1] = b;
          c = arrx[j];
          arrx[j] = arrx[j + 1];
          arrx[j + 1] = c;
        }
      }
    }
    // 获取总量
    const sum = arry.reduce((sum, item, index) => (sum += item), 0);
    // 计算单个百分比
    const yData1 = arry.map((item) => {
      const num = +((item / sum) * 100).toFixed(2);
      return num;
    });
    let baiFenSum = 0;
    // 计算累计百分比
    const Long1 = yData1.map((item) => {
      baiFenSum += item;
      return baiFenSum.toFixed(0);
    });
    // 补0 是为了echarts 更好的现实   在E charts中会进行处理  不做显示

    console.log(arrx, arry, Long1);
    const myChart = echarts.init(this.divRef);
    let option = {
      title: {
        text: this.titleText ? this.titleText : "帕累托图",
        // subtext:'数据纯属瞎、编',
        left: this.titlePosition ? this.titlePosition : "center",
      },
      tooltip: {
        trigger: "item",
        // formatter: "{c}",
        /*axisPointer:{
              type:'line'
          }*/
      },
      // legend: {
      //   data: ["指标", { name: "增长率（%）", icon: "circle" }],
      //   // icon:'roundRect',
      //   // orient:'vertical',
      //   // right:'14%',
      //   // bottom:'60%'
      // },
      grid: {
        // x: 0,
        // y: 0,
        // x2: 0,
        y2: "25%",
        borderWidth: 0,
      },
      xAxis: [
        {
          splitLine: {
            show: false,
          },
          data: arrx,
          axisLabel: {
            formatter: function (value) {
              var newValue = value.split("").join("\n");
              var newParamsName = ""; // 最终拼接成的字符串
              var paramsNameNumber = newValue.length; // 实际标签的个数
              var provideNumber = 10; // 每行能显示的字的个数
              // 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
              if (paramsNameNumber > provideNumber) {
                // ********重点在这里********
                newParamsName = newValue.substring(0, 10) + ".\n.\n."; // 最终拼成的字符串
              } else {
                // 将旧标签的值赋给新标签
                newParamsName = newValue;
              }
              // 将最终的字符串返回
              return newParamsName;
            },
            textStyle: {
              color: "black", //文字颜色
              fontSize: "20px",
            },
          },
        },
        {
          splitLine: {
            show: false,
          },
          boundaryGap: false,
          axisLabel: {
            show: false,
          },
          data: arrx,
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLabel: {
            // show:false
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
          },
        },
        {
          type: "value",
          axisLabel: {
            // show:false
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: "开发当量",
          type: "bar",
          xAxisIndex: 0,
          yAxisIndex: 0,
          // silent:true,
          barWidth: "40%",
          itemStyle: {
            normal: {
              color: this.barColor ? this.barColor : "#7CBADD",
            },
          },
          markLine: {
            /*以下设置一行后，平均线就没有开始和结束标记了（即看不见箭头了）*/
            symbol: "none",
            data: [
              {
                name: "",
                // 支持 'average', 'min', 'max'
                // type: "average",
                xAxis: this.markingPosition ? this.markingPosition : arrx[0],
                animation: false,
                label: {
                  position: "insideMiddleBottom",
                  formatter: this.markingText ? this.markingText : "test",
                  fontSize: this.tipLineFontSize ? this.tipLineFontSize : "32px",
                },
                lineStyle: {
                  normal: {
                    color: "#5AAEF4",
                    width: 2,
                    type: "dashed",
                  },
                },
              },
            ],
          },
          label: {
            normal: {
              show: true,
              position: "top",
              //formatter:'{c}
              textStyle: {
                fontWeight: "bold",
                fontSize: 20,
                color: "#B6BDBD",
              },
            },
          },
          data: arry,
        },
        {
          name: "（%）",
          type: "line",
          xAxisIndex: 0,
          yAxisIndex: 1,
          smooth: true,
          clipOverflow: false,
          symbolSize: 9,
          itemStyle: {
            normal: {
              color: this.lineColor ? this.lineColor : "#FF0000",
              // borderColor: '#FF0000',
              // borderWidth: 3,
            },
          },
          lineStyle: {
            normal: {
              //color:,
              width: 4,
            },
          },
          data: Long1,
        },
      ],
    };
    myChart.setOption(option);
    function debounce(func, ms = 1000) {
      let timer;
      return function (...args) {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          func.apply(this, args);
        }, ms);
      };
    }
    const task = () => {
      console.log("resize");
      myChart.resize();
    };
    const debounceTask = debounce(task, 1000);
    window.addEventListener("resize", debounceTask);
  }

  componentDidMount() {
    const { dataSource, updateProcess, componentId } = this.props;
    const data = dataSource;
    this.initEcharts(data);
    window?.componentCenter?.register(componentId, "comp", this, {
      events,
      actions,
    });
    updateProcess && updateProcess();

    this.Event_Center_getName = () => {
      return "Demo实例";
    };
  }

  do_EventCenter_messageSuccess(param) {
    console.log(param);
    alert("动作执行成功！");
  }

  render() {
    const { componentId } = this.props;
    return (
      <div
        ref={this.fnref}
        onClick={() => {
          window?.eventCenter?.triggerEvent(componentId, "onClick", {
            name: "二开插件",
          });
        }}
        style={{ width: "100%", height: "100%" }}
      ></div>
    );
  }
}
