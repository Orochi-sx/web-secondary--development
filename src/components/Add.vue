<template>
  <div class="map">
    <div id="containerAdd" :style="mapStyle" ref="containerAdd"></div>
    <div class="map_button">
      <el-button type="success" size="mini" round v-show="!geocoderButton" ref="geocoderClickOn">开启详细定位</el-button>
      <el-button type="primary" size="mini" round v-show="geocoderButton" ref="geocoderClickOff">关闭详细定位</el-button>
      <el-button type="success" size="mini" round v-show="!overlaysButton" ref="mouseToolClickOn">开启路线绘制</el-button>
      <el-button type="primary" size="mini" round v-show="overlaysButton" ref="mouseToolClickOff">关闭路线绘制</el-button>
      <el-button type="success" size="mini" round ref="clearMouseTool">清除覆盖物</el-button>
    </div>
  </div>
</template>

<script>
import eventActionDefine from "./msgCompConfig";
// import AMapLoader from '@amap/amap-jsapi-loader'

window._AMapSecurityConfig = {
  securityJsCode:'d6916f1f375303ccb0c2fff4d752b46a',
};

export default {
  name: "Add",

  props: {
    customConfig: Object,
  },

  data() {
    return {
      data: this.customConfig.data,
      propsConfiguration: this.customConfig.configuration,
      configuration: {},
      mapStyle: '',
      mapCityCenter: '',
      map: null,
      geocoderButton: false,
      overlaysButton: false,
      mapCenterPoint: null
    };
  },

  created() {

    let mapData = JSON.parse(this.propsConfiguration)

    this.mapStyle = `width: ${mapData.mapWidth}; height: ${mapData.mapHeight};`

    this.overlaysButton = false
    this.geocoderButton = false

    if(mapData.mapCityCenter.length <= 1) {
      let centerPoint = mapData.mapCityCenter[0].toString().split(',')
      this.mapCityCenter = [ Number(centerPoint[0]), Number(centerPoint[1]) ]

    } else {
      let centerPoint = mapData.mapCityCenter[1].toString().split(',')
      this.mapCityCenter = [ Number(centerPoint[0]), Number(centerPoint[1]) ]
    }
  },

  mounted() {
    window?.componentCenter?.register(
      this.customConfig.componentId,
      "comp",
      this,
      eventActionDefine
    );
    try {
      this.configuration = JSON.parse(this.propsConfiguration);
    } catch (error) {
      console.error("configuration解析错误", error);
    }

    this.initMap()

    window.loadMap = this.do_EventCenter_loadMap
  },

  methods: {
    initMap() {
      this.AMapLoader.load({
        "key": "4f9ebccb236519f688c2545d15e5242d",
        "version": "2.0",
        "plugins": [
          'AMap.DistrictSearch',
          'AMap.Geocoder',
          'AMap.MouseTool'
        ]
      }).then( (AMap) => {
        let centerPoint = this.mapCityCenter ? this.mapCityCenter : [118.432581,32.423072]
        if(this.mapCenterPoint) {
          centerPoint = this.mapCenterPoint
        }
        let map = new AMap.Map(this.$refs['containerAdd'],{ zoom: 13, zooms:[9,15], center: centerPoint })

        let marker = null
        if(this.mapCenterPoint) {
          let carIcon = new AMap.Icon({
            image: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
            imageSize: new AMap.Size(25, 34),
          });
          marker = new AMap.Marker({
            icon: carIcon,
            position: centerPoint,
            offset: new AMap.Pixel(-13, -30)
          })
          map.add(marker)
        }

        this.map = map
        let _that = this
        let mapMouseTool = {}

        // 详细定位
        function getDetailAddress(e){
          let lnglat = [e.lnglat.getLng(),e.lnglat.getLat()]
          map.setCenter(lnglat)
          AMap.plugin('AMap.Geocoder', () => {
            let geocoder = new AMap.Geocoder({ extensions: 'all' })
            geocoder.getAddress(lnglat, (status, result) => {
              if (status === 'complete' && result.info === 'OK') {
                let townShip = result.regeocode.addressComponent.township
                let address = result.regeocode.formattedAddress;
                console.log(address)
                window?.eventCenter?.triggerEvent(_that.customConfig.componentId, "getDetaiAddress", {
                  townShip: townShip,
                  detailAddress: address,
                  lng: e.lnglat.getLng(),
                  lat: e.lnglat.getLat()
                });
              }
            })
          })
        }
        // 开启详细定位事件
        this.$refs['geocoderClickOn'].$el.addEventListener('click', () => {
          this.geocoderButton = true
          map.on('click', getDetailAddress);
        })
        // 关闭详细定位事件
        this.$refs['geocoderClickOff'].$el.addEventListener('click', () => {
          this.geocoderButton = false
          map.off('click', getDetailAddress);
        })
        
        // 创建路线绘制
        function createMouseTool() {
          let mouseTool = new AMap.MouseTool(map)

          mouseTool.polyline({
            strokeColor: "#3366FF", 
            strokeOpacity: 1,
            strokeWeight: 6,
            strokeStyle: "solid",
          })
          mapMouseTool = mouseTool

          mouseTool.on('draw', function(event) {
            if(event.obj) {
              let length = ''
              // 定时器为了延迟获取event的正确数据
              setTimeout( ()=>{
                length = event.obj.sC
                window?.eventCenter?.triggerEvent(_that.customConfig.componentId, "getDrawPolyline", {
                  length: length
                });
              },300)
            }
          })
        }
        // 开启路线绘制事件
        this.$refs['mouseToolClickOn'].$el.addEventListener('click', () => {
          this.overlaysButton = true
          createMouseTool()
        })
        // 关闭路线绘制事件
        this.$refs['mouseToolClickOff'].$el.addEventListener('click', () => {
          this.overlaysButton = false
          mapMouseTool.close()
        })
        // 清理绘制覆盖物
        this.$refs['clearMouseTool'].$el.addEventListener('click', () => {
          let polyline = map.getAllOverlays(AMap.Overlay)
          polyline.pop()
          map.remove(polyline)
        })
        
        // 地图遮罩
        new AMap.DistrictSearch({ extensions:'all', subdistrict:0 }).search('来安县',function(status,result){
          let outer = [
            new AMap.LngLat(-360,90,true),
            new AMap.LngLat(-360,-90,true),
            new AMap.LngLat(360,-90,true),
            new AMap.LngLat(360,90,true),
          ];
          let holes = result.districtList[0].boundaries
          let pathArray = [ outer ];
          pathArray.push.apply(pathArray,holes)
          let polygon = new AMap.Polygon( {
              pathL:pathArray,
              strokeColor: '#00eeff',
              strokeWeight: 1,
              fillColor: '#71B3ff',
              fillOpacity: 0.5
          });
          polygon.setPath(pathArray);
          map.add(polygon)
        })
      }).catch( (e) => {
        this.map = null
        this.initMap()
      })
    },

    async inputChange(e) {
      this.data = JSON.stringify(e);
      let { formConfig, component, onChange } = this.customConfig;
      await window?.eventCenter?.triggerEventNew({
        objectId: formConfig?.id,
        componentId: component.id,
        type: "report",
        event: "change",
        payload: {
          value: JSON.stringify(e),
        },
      });
      onChange(JSON.stringify(e));
    },

    Event_Center_getName() {
      let { formConfig, component } = this.customConfig;
      return `${formConfig?.form_name}-${component.columnStyle.title}`;
    },
    do_EventCenter_changeCenterPoint(value) {
      this.map.setCenter([value.mapLng, value.mapLat])
      this.map.setZoom(13)
    },
    do_EventCenter_loadMap(value) {
      this.mapCenterPoint = [value.mapLng, value.mapLat]
      this.initMap()
    },
    Event_Center_getName() {
      return this.data;
    },
  },

  destroyed() {
    window?.componentCenter?.removeInstance(this.customConfig.componentId);

    this.map && this.map.destroy();
  },
};
</script>

<style>
  .map {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .map_button {
    position: absolute;
    top: 20px;
    right: 20px;
  }
</style>
