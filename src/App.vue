<template>
  <div class="echart-box">
    <zfw ref="zfw"></zfw>
  </div>
</template>

<script>
import './index.css'
import {Cartesian3,Math} from 'cesium';
import { queryAssetById } from './api/asset'
export default {
  props: {
    dataSource: {
      type: Array,
      default: () => [],
    },
    componentId: {
      type: String | undefined,
      default: '',
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
      default: () => {},
    },
  },
  data() {
    return {
      pointList: [],
      assetArray: [],
      mapper: {
        残疾人: '0',
        出租车群体: '1',
        婚姻家庭: '2',
        计划生育特殊家庭: '3',
        交通管理: '4',
        垃圾场站建设维护: '5',
        邻里关系: '6',
        企业改制: '7',
        欠薪讨薪: '8',
        群体利益受损: '9',
        涉法涉诉: '10',
        涉房: '11',
        涉军: '12',
        涉教: '13',
        师生校园: '14',
        跳江跳楼: '15',
        扬言报复社会: '16',
        扬言进京或群访极端行为: '17',
        债务纠纷: '18',
        养老诈骗: '19',
        意外事故: '20',
      },
    }
  },
  computed: {},
  mounted() {
    const events = []
    const actions = [
      {
        key: 'class',
        name: '分类',
        params: [
          {
            key: 'type',
            name: '分类值',
            dataType: 'string',
          },
        ],
      },
    ]

    this.componentId &&
      window.componentCenter?.register &&
      window.componentCenter.register(this.componentId, 'comp', this, {
        events,
        actions,
      })
    this.updateProcess && this.updateProcess()
    // 地图请求
    this.$refs.zfw.init({
      // imageryServiceUrl: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer', // 外网天地图
      // tilesetUrl: 'http://10.15.60.105:3000/tileset.json', // 本地
      imageryServiceUrl: 'http://10.34.4.103:8010/ServiceAdapter/MAP/YX_WEB/6f9c5d19634442a3accb406539ef09dc', //政务网 有次数限制
      // imageryServiceUrl: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',//政务网
      // tilesetUrl: '/model/tileset.json', // 图层
      tilesetUrl: 'http://10.15.25.150:8080/zhuan/tileset.json',// 倾斜图层
      // cameraOption: {
      //   destination: Cartesian3.fromDegrees(114.32603, 30.45222, 2700.0), // 经，纬度，高程
      //   orientation: {
      //     heading: Math.toRadians(-25.16), // 仰角
      //     pitch: Math.toRadians(347.41), // 航偏角
      //     roll: 0.0, // 翻滚角
      //   },
      // },
      cameraOption: {
        destination: Cartesian3.fromDegrees(114.32555, 30.43555, 6200.0), // 经（左右），纬度（上下），高程
        orientation: {
          heading: Math.toRadians(-22.00), // 航偏角
          pitch: Math.toRadians(332.55), // 仰角
          roll: 0.0, // 翻滚角
        },
      },
    })
    this.getAssets() // 资产数据
  },
  methods: {
    // 逻辑控制用，不可删，return内容可改
    Event_Center_getName: () => {
      return '地图点位入参'
    },
    do_EventCenter_class(param) {
      console.log(param)
      this.loadPoint(param.type)
    },
    // 点位加载：
    loadPoint(param) {
      this.pointList = this.assetArray.filter((ele) => {
          return ele.sjnrbq == param
        }).map((x) => {
          return {
            longitude: Number(x.sjtjjd), //经度
            latitude: Number(x.sjtjwd), //纬度
            type: this.mapper[x.sjnrbq], //标签分类 0~18
          }
        })
      this.$nextTick(() => {
        this.$refs.zfw.setPOI(this.pointList)
      })
    },
    // 地图资产接口
    async getAssets() {
      let id = this.options.externalVariables.assetId;
      let assetId = id ? id : 'b7ef7aaf-edb8-14e4-97ce-da810e2fb132';
      await queryAssetById(assetId).then((res) => {
        this.assetArray = this.translatePlatformDataToJsonArray(res.data)
      })
    },
    // 资产处理
    translatePlatformDataToJsonArray(originTableData) {
      let originTableHeader = originTableData[0]
      let tableHeader = []
      originTableHeader.forEach((item) => {
        tableHeader.push(item.col_name)
      })
      let tableBody = originTableData[1]
      let tableData = tableBody.map((tableItem) => {
        let temp = {}
        tableItem.forEach((item, index) => {
          temp[tableHeader[index]] = item
        })
        return temp
      })
      return tableData
    },
  },
}
</script>

<style lang="less" scoped>
.echart-box {
  width: 100%;
  height: 100%;
}
</style>
