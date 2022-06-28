import React, { Component } from "react";
import * as echarts from 'echarts';
// import { Table, Button, message } from "antd";
import "./app.less";

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
  myeCharts = React.createRef()

  state = {
    dataSource: [],
    rowId: "",
    columns: [],
    options:{}
  };

  constructor(props) {
    super(props);
    const { pubSub } = props;
    
    pubSub?.subscribe &&
      pubSub.subscribe("analyzeDataSource", data => {
        this.loadTableFromData && this.loadTableFromData(data);
      });
  }

  echartsInit() {
    var chartDom = this.refs.xxeCharts
    var myChart = echarts.init(chartDom);
    var option
    // 散点数据
    var marksData = []
    let dataInfo = this.dataSource.filter((d,i)=>{
      return i!==0
    });
    let titleArr = this.dataSource[0]


    let allXnum = []
    let allYnum = []
    dataInfo.forEach(d=>{
      allXnum.push(d[1])
      allYnum.push(d[2])
    })
    allXnum.sort()
    allYnum.sort()
    console.log('allXnum==',allXnum);
    console.log('allYnum==',allYnum);
    // let YmaxNum = allYnum[allYnum.length -1]
    // let YminNum = allYnum[0]
    let Xmax = allXnum[allXnum.length -1]
    let Xmin = allXnum[0]
    let colorConfigArr = this.props.options.externalVariables.colorConfig.split(',')
    let sectorNameConfigArr = this.props.options.externalVariables.sectorName.split(',')
    let sectorBackgroundColorConfigArr = JSON.parse(this.props.options.externalVariables.sectorColor) 
    let centerLineColor = this.props.options.externalVariables.centerColor
    let yMax = this.props.options.externalVariables.yMax
    let ymin = this.props.options.externalVariables.yMin
    let titleColor = this.props.options.externalVariables.titleColor
    let titleSize = this.props.options.externalVariables.titleSize
    let titleText = this.props.options.externalVariables.titleText
    let middleYNum = (yMax&ymin) + ((yMax^ymin)>>1)
    let middleXNum = (Xmax&Xmin) + ((Xmax^Xmin)>>1)
    // console.log('middleXNum==',middleXNum);
    dataInfo.forEach((item,index) => {
      marksData.push({
        name: item[0],
        value: [Number(item[1]), Number(item[2])],
        // 需要特殊处理数据，看坐标点属于哪个markArea区域获取对应color色值
        // 同时如果要处理tooltip的边框颜色，就需要单独设置tooltip
        color: '#FFCCCC',
        itemStyle: {
          color: colorConfigArr[index],//点的颜色
          opacity: 1,
        },
        tooltip: {
          borderColor: '#FFCCCC',
          borderWidth: 5,
          formatter: '{b0}<br/>{c0}<br/>',
        },
      })
    });

    // 中心线
    let centerLine = [
      {
        name: '',
        xAxis: middleXNum,//50
      },
      {
        name: '',
        yAxis: middleYNum,//40
      },
    ];
    // 中心点
    // let centerMark = [
    //   {
    //     value: '中心点',
    //     coord: [40, 40],
    //   },
    // ];

    option = {
      // backgroundColor:'#cccccc',
      title:{
        text:titleText,
        textStyle:{
          color:titleColor,
          fontSize:titleSize,
        }
      },
      tooltip: {
        trigger: 'item',
        // confine: true,
        backgroundColor: '#fff',

        textStyle: {
          color: '#000',
          fontSize: 12,
        },
      },
      grid: {
        left: 50,
        right: '8%',
        bottom: '4%',
        top: '6%',
        containLabel: true,
      },
      xAxis: {
        name: titleArr[1],
        scale: true,
        
        axisLine: {
          symbol: 'none',
          lineStyle: {
            color: '#ccc',
            width: 1,
          },
        },
        axisLabel: {
          color: '#000',
        },
        splitLine: {
          show: true,
        },
      },
      yAxis: {
        name: titleArr[2],
        scale: true,
        min:ymin,
        max:yMax,
        axisLine: {
          symbol: 'none',
          lineStyle: {
            color: '#ccc',
            width: 1,
          },
        },
        axisLabel: {
          color: '#000',
        },
        splitLine: {
          show: true,
        },
      },
      series: [
        {
          type: 'scatter',
          data: marksData,
          label: {
            show: true,
            position: 'top',
            formatter: '{b}',
          },
          // itemStyle: {
          //     color: '#fff',
          //     borderColor: '#409eff',
          //     borderWidth: 1.5,
          // },
          // 各象限区域
          markArea: {
            silent: true,
            label: {
              distance: 16,
              color: '#606266',
              fontSize: 14,
            },
            data: [
              [
                //第一象限
                {
                  name: sectorNameConfigArr[0],
                  xAxis: middleXNum, // x 轴开始位置
                  yAxis: yMax, // y 轴结束位置(直接取最大值)
                  backgroundColor: 'blue',
                  itemStyle: sectorBackgroundColorConfigArr[0],
                  label: {
                    position: 'insideBottomRight',
                  },
                },
                {
                  yAxis:middleYNum, // y轴开始位置
                },
              ],
              [
                //第二象限
                {
                  name: sectorNameConfigArr[1],
                  yAxis: yMax, // y 轴结束位置(直接取最大值)
                  xAxis:0,
                  itemStyle: sectorBackgroundColorConfigArr[1],
                  label: {
                    position: 'insideBottomLeft',
                  },
                },
                {
                  xAxis: middleXNum, // x 轴结束位置
                  yAxis: middleYNum, // y轴开始位置
                },
              ],
              [
                //第三象限
                {
                  name: sectorNameConfigArr[2],
                  yAxis: middleYNum, // y 轴结束位置
                  itemStyle: sectorBackgroundColorConfigArr[2],
                  label: {
                    position: 'insideTopLeft',
                  },
                },
                {
                  xAxis: middleXNum, // x 轴结束位置
                  yAxis: ymin, // y轴开始位置
                },
              ],
              // 第四象限
              [
                {
                  name: sectorNameConfigArr[3],
                  xAxis: middleXNum, // x 轴开始位置
                  yAxis: middleYNum, // y 轴结束位置
                  itemStyle: sectorBackgroundColorConfigArr[3],
                  label: {
                    position: 'insideTopRight',
                  },
                },
                {
                  yAxis: ymin, // y轴开始位置
                },
              ],
            ],
          },
          // 中心点交集象限轴
          markLine: {
            silent: true, // 是否不响应鼠标事件
            precision: 2, // 精度
            symbol: 'none',
            lineStyle: {
              type: 'solid',
              color: centerLineColor,//中线颜色
            },
            label: {
              color: '#fff',
              lineHeight: 24,
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 500,
              padding: [0, 12],
              position: 'end',
              formatter: '{b}',
            },
            data: centerLine,
          },
        },
      ],
    };
    option && myChart.setOption(option);
    window.addEventListener('resize',()=>{
      myChart.resize()
      // console.log('123');
    })



  }



  componentDidMount() {
    const { dataSource, updateProcess, componentId ,options} = this.props;
    this.dataSource = dataSource;
    this.options = options
    this.echartsInit()

    window?.componentCenter?.register(componentId, "comp", this, {
      events,
      actions,
    });
    updateProcess && updateProcess();

    this.Event_Center_getName = () => {
      return "象限图";
    };
    window.addEventListener('resize',()=>{
      // myChart.resize()
      console.log('123');
    })


  }
  render() {
    return (
        <div ref="xxeCharts" id="xxeCharts" style={{ width: '100%', height: '100%' }}></div>
    );
  }
}
