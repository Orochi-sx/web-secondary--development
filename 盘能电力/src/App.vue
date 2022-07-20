<template>
  <div className="analyzer-vue-demo" :style="{
    width: '100%',
    height: '100%',
  
  }">
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
          text: "kWh",
          left: "60px",
          textStyle: {
            color: "#000000",
            fontSize: 14,
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
          itemWidth: 15,
          itemHeight: 15,
          data: ["上网电量", "自发自用发电量", "消纳率(%)"],
        },
        xAxis: {
          data: [
            '长沙', '株洲', '湘潭', '岳阳', '益阳', '常德', '娄底', '邵阳', '衡阳', '永州', '郴州', '怀化', '张家界', '湘西', '德胜', '益为', '绿岛', '兴新'
          ],
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#000', // 颜色
              width: 4 // 粗细
            }
          },
          axisLabel: {
            // inside: false,
            textStyle: {
              color: '#000',
              fontSize: '14',
              itemSize: ''

            }

          }
        },
        yAxis: {
          type: "value",
          // data: [0, 10, 20, 30, 40, 50, 60],
          // splitLine: {
          //   show: false,
          // },
        },
        series: [
          {
            name: "自发自用发电量",
            type: "bar",
            stack: "使用情况",
            data: [45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62],
            itemStyle: {
              normal: {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgb(56, 108, 166) ",
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
                    color: "#42ac8d",
                    fontSize: 14,
                    fontWeight: 600,
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
          },
        ],
      },
    };
  },
  computed: {
    tableDataHeader() {
      return (this.dataSource[0] || []).map((t) => ({
        prop: t,
        label: t,
      }));
    },
    tableData() {
      let [header, ...tableData] = this.dataSource;
      tableData = tableData || [];
      return tableData.map((d) =>
        (window?._?.zipObject || zipObject)(header, d)
      );
    },
    // colorArr(){
    //   return{c  }this.options.externalVariables.color
    // }
  },
  created() {
    // console.log(this.tableData, "===============tableData");

    //处理资产里的数据
    let dataArr2 = []
    let addArr = []
    let dataArr1 = this.tableData.map(x => {
      dataArr2.push(x.on_grid_electricity_consumption)
      addArr.push(x.region)
      return x.self_generating_capacity
    })

    this.options1.series[0].data = dataArr1
    this.options1.series[1].data = dataArr2
    this.options1.xAxis.data = addArr
    console.log(dataArr1, dataArr2, '==========ll');


    let that = this;
    this.options1.series[1].itemStyle.normal.label.formatter = function (val) {
      // let data1 = that.temp1[val.dataIndex];
      //如果用资产就用这个
      let data1 = dataArr1[val.dataIndex];

      let temp = data1 + val.data;
      // console.log(((62 / 105) * 100).toFixed(2));
      return ((data1 / temp) * 100).toFixed(2);
    };
  },
  mounted() {
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
}

.showBox {
  background-color: #4b4b4b;
}
</style>