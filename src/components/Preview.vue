<template>
  <div class="map">
    <div id="containerPreview" :style="mapStyle" ref="containerPreview"></div>
  </div>
</template>

<script>

window._AMapSecurityConfig = {
  securityJsCode:'d6916f1f375303ccb0c2fff4d752b46a',
};

export default {
  name: "Preview",
  props: {
    customConfig: Object,
  },
  data() {
    return {
      data: '',
      configuration: {},
      mapStyle: '',
      mapCityCenter: '',
      map: null,
      geocoderButton: false,
      overlaysButton: false,
    };
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
        let map = new AMap.Map(this.$refs['containerPreview'],{ zoom: 10, zooms:[9,15], center: centerPoint })

        this.map = map

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
      }).catch( () => {
        this.map = null
        this.initMap()
      })
    },
  },

  created() {
    let { component } = this.customConfig;

    if(component.columnStyle.customPluginConfig) {
      let style = JSON.parse(component.columnStyle.customPluginConfig)

      this.mapStyle = `width: ${style.mapWidth}; height: ${style.mapHeight};`
      
      if(style.mapCityCenter.length <= 1) {
        let centerPoint = style.mapCityCenter[0].toString().split(',')
        this.mapCityCenter = [ Number(centerPoint[0]), Number(centerPoint[1]) ]
      } else {
        let centerPoint = style.mapCityCenter[1].toString().split(',')
        this.mapCityCenter = [ Number(centerPoint[0]), Number(centerPoint[1]) ]
      }

    } else {
      this.mapStyle = 'width: 500px; height: 500px;'
      this.mapCityCenter = [118.432581,32.423072]
    }

    this.overlaysButton = false
    this.geocoderButton = false

  },
  mounted() {
    this.initMap()
  },
};
</script>

<style>
  .map {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>