<template>
  <div className="analyzer-vue-demo" :style="{
    width: '100%',
    height: '100%',
  
  }" ref="analyzer">
    <div class="echarts" ref="echart"></div>
  </div>
</template>

<script>
const zipObject = (arr1, arr2) => {
  const ret = {};
  arr1.forEach((item, index) => {
    ret[item] = arr2[index];
  });
  return ret;
};



import * as echarts from "echarts";
export default {
  props: {
    dataSource: {
      type: Array,
      default: () => [],
    },
    componentId: {
      type: String | undefined,
      default: "",
    },
    options: {
      type: Object,
      default: () => ({
        // 配置项从externalVariables里取
        externalVariables: {},
      }),
    },
    updateProcess: {
      type: Function,
      default: () => { },
    },
  },
  data() {
    return {
      temp1: [45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62],
      temp2: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43],
      options1: {
        title: {
          text: "万kWh",
          left: "60px",
          top: '20px',
          textStyle: {
            color: "#666666",
            fontSize: 12,
          },
        },
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(75, 75, 75,0.7)",
          textStyle: {
            color: "#fff", //字体颜色，
            fontSize: 13, //字体大小
          },
          borderColor: "rgba(75, 75, 75,0.7)",
          formatter: function (params) {
            console.log(params, '==========');
            let res =
              "总电量: " +
              (params[0].data + params[1].data) +
              "<br>" +
              "自发自用电量: " +
              params[0].data +
              "<br>" +
              "上网电量: " +
              params[1].data +
              "<br>";

            return (
              '<div class="showBox"  style="bcakground:#4b4b4b"  >' +
              res +
              "</div>"
            );
            //  params[0].seriesName + '：' + params[0].data + '<br>' +
            //  params[1].seriesName + '：' + params[1].data + '<br>' +
            //  params[2].seriesName + '：' + params[2].data + '<br>' +
            //  params[3].seriesName + '：' + params[3].data + '<br>' +
            //  params[4].seriesName + '：' + params[4].data + '<br>'
          },
        },
        legend: {
          data: ["上网电量", "自发自用发电量", "消纳率(%)"],
        },
        xAxis: {
          data: [
          ],
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              width: 1// 粗细
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            interval: 0,//使x轴文字显示全
            textStyle: {
              fontSize: '12',
              itemSize: '',
              fontWeight: 400,
              fontFamily: "Alibaba PuHuiTi"
            },
            rotate: 45
          }
        },
        yAxis: {
          type: "value",
          axisLabel: {
            textStyle: {

              fontSize: '12',
              itemSize: '',
              fontWeight: 400,
              fontFamily: "Alibaba PuHuiTi"
            },
          }
          // data: [0, 10, 20, 30, 40, 50, 60],
          // splitLine: {
          //   show: false,
          // },
        },
        series: [
          {
            name: "自发自用发电量",
            barWidth: 21,
            type: "bar",
            stack: "使用情况",
            data: [45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62],
            itemStyle: {
              normal: {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgb(56, 108, 166)",
                  },
                  {
                    offset: 1,
                    color: "rgb(55, 120, 137)",
                  },
                ]),
              },
            },
          },
          {
            name: "上网电量",
            type: "bar",
            stack: "使用情况",
            barWidth: 21,
            data: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43],
            itemStyle: {
              normal: {
                label: {
                  show: true, //开启显示
                  position: "top", //在上方显示
                  formatter: function (val) {
                    // let data1 = options1.series[0].data[val.dataIndex];
                    // let temp = data1 + val.data;
                    // // let temp = val[0] + val[1];
                    // return parseInt((data1 / temp) * 100);
                  },
                  textStyle: {
                    //数值样式
                    color: "#996699",
                    fontSize: 10,
                    fontWeight: 400,

                    fontFamily: "Alibaba PuHuiTi",
                  },
                },
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgb(65, 170, 139)",
                  },
                  {
                    offset: 1,
                    color: "rgb(36, 222, 212)",
                  },
                ]),
              },
            },
          },
          {
            name: "消纳率(%)",
            type: "bar",
            stack: "使用情况",

            itemStyle: {
              normal: {
                // color: '#996699'
                color: '#CCCC99'
              }
            }
          },
        ],
      },
    };
  },
  computed: {
    tableDataHeader() {
      return (window.__analysisData[0] || this.dataSource[0] || []).map((t) => ({
        prop: t,
        label: t,
      }));
    },
    tableData() {
      let [header, ...tableData] = window.__analysisData || this.dataSource
      tableData = tableData || [];
      return tableData.map((d) =>
        (window?._?.zipObject || zipObject)(header, d)
      );
    },
    columnarColorOne() {
      let colorTemp = this.options.externalVariables.渐变色1.split(',').length == 2 ? this.options.externalVariables?.渐变色1 : '#386CA6,#377889'
      return colorTemp.split(',')
    },
    columnarColorTwo() {
      let colorTemp = this.options.externalVariables.渐变色2.split(',').length == 2 ? this.options.externalVariables?.渐变色2 : '#41AA8B,#24DED4'
      return colorTemp.split(',')
    },
    labelColor() {
      return this.options.externalVariables.头部文字颜色 || '#996699'
    },
    labelArr() {
      let labelTemp = this.options.externalVariables.标签名称 ? this.options.externalVariables.标签名称.split(',') : ["上网电量", "自发自用发电量", "消纳率(%)"]

      return labelTemp
    }
    // colorArr(){
    //   return{c  }this.options.externalVariables.color
    // }
  },
  created() {


    // console.log(this.dataSource, "===============tableData");
    let tableD = JSON.parse(JSON.stringify(this.dataSource))
    tableD.shift()
    //处理资产里的数据
    let dataArr2 = []
    let addArr = []
    let dataArr1 = tableD.map(x => {
      dataArr2.push(x[2])
      addArr.push(x[0])
      return x[1]
    })

    this.options1.series[0].data = dataArr1
    this.options1.series[1].data = dataArr2
    this.options1.xAxis.data = addArr

    // console.log(dataArr1, dataArr2, '==========ll');


    // let that = this;
    this.options1.series[1].itemStyle.normal.label.formatter = function (val) {
      // let data1 = that.temp1[val.dataIndex];
      //如果用资产就用这个
      let data1 = dataArr1[val.dataIndex];

      let temp = data1 + val.data;
      // console.log(((62 / 105) * 100).toFixed(2));
      return ((data1 / temp) * 100).toFixed(2);
    };

    this.options1.series[1].itemStyle.normal.label.textStyle.color = this.labelColor
    this.options1.series[0].itemStyle.normal.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      {
        offset: 0,
        color: this.columnarColorOne[0],
      },
      {
        offset: 1,
        color: this.columnarColorOne[1],
      },
    ])
    this.options1.series[1].itemStyle.normal.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      {
        offset: 0,
        color: this.columnarColorTwo[0],
      },
      {
        offset: 1,
        color: this.columnarColorTwo[1],
      },
    ])
    this.options1.series[2].itemStyle.normal.color = this.labelColor
    this.options1.legend.data = this.labelArr
    this.options1.series.forEach((item, i) => {
      item.name = this.labelArr[i]
    })
  },
  mounted() {
    this.$refs.analyzer.parentNode.style.height = "100%"
    this.$refs.analyzer.parentNode.style.width = "100%"
    this.$refs.analyzer.addEventListener("resize", function () {


    })
    this.initFn();
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

    this.componentId &&
      window.componentCenter?.register &&
      window.componentCenter.register(this.componentId, "comp", this, {
        events,
        actions,
      });
    this.updateProcess && this.updateProcess();
  },
  methods: {
    initFn() {
      let Gechart = echarts.init(this.$refs.echart);
      // this.option.series[0].data = this.nodeD;
      // this.option.series[0].links = this.linkD;
      Gechart.setOption(this.options1);
    },
    clickBt() {
      this.componentId &&
        window.eventCenter?.triggerEvent &&
        window.eventCenter.triggerEvent(this.componentId, "onClick", {
          name: "二开插件",
        });
    },
    // 逻辑控制用，不可删，return内容可改
    Event_Center_getName: () => {
      return "Demo实例";
    },
    do_EventCenter_messageSuccess(param) {
      console.log(param);
      alert("动作执行成功！");
    },
  },
};
</script>


<style lang="less" scoped>
.echarts {
  height: 100%;
  // height: 900px;
  // width: 600px;
}

.showBox {
  background-color: #4b4b4b;
}
</style>