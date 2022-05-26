<template>
  <div class="treeMap">
    <el-card class="tree" header="车辆监控">
      <!-- 搜索 -->
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @submit.native.prevent>
        <el-form-item prop="searchValue">
          <el-input placeholder="请输入内容" v-model="dataForm.searchValue" size="small" @input="inputChange" maxlength="7">
            <el-button slot="append" icon="el-icon-search" @click="searchLicensePlate"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <!-- 树形控件 -->
      <el-tree :data="treeShowList" default-expand-all @node-click="handleNodeClick" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree"></el-tree>
    </el-card>
    <!-- 地图组件 -->
    <div ref="container" :style="mapStyle"></div>
    <!-- 运动轨迹 -->
    <div class="map_moveAnimation" v-if="moveAnimationVedioShow">
      <div class="colose_map" @click="closeMoveAnimationVedio()">x</div>
      <div class="moveAnimation_title">视频监控</div>
      <div class="moveAnimation_vedio">
        <div class="vedio_none" v-if="!videoUrl">暂无视频</div>
        <video v-if="videoUrl" muted autoplay loop :src="videoUrl" class="map_MoveAnimation_Video"></video>
      </div>
    </div>
    <div class="map_moveAnimation" v-if="moveAnimationShow">
      <div class="colose_map" @click="closeMoveAnimation()">x</div>
      
      <div class="moveAnimation_title">历史轨迹回放</div>
      <div class="moveAnimation_info">
        <div class="moveAnimation_picker">
          <el-form :model="pickerForm" @submit.native.prevent label-width="80px">
            <el-form-item label="选择范围">
              <el-date-picker v-model="pickerForm.dataPicker" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small"></el-date-picker>
            </el-form-item>
          </el-form>
          <el-button type="primary" round @click="startAnimation" size="small" style="margin: -10px 0 0 15px;">开始播放</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import appService from "@njsdata/app-sdk";
import eventActionDefine from "./components/msgCompConfig";
import "./index.css";
import _ from 'lodash'

import { queryAssetById } from './api/asset'

window._AMapSecurityConfig = {
  securityJsCode:'d6916f1f375303ccb0c2fff4d752b46a',
};

export default {
  name: "App",

  props: {
    customConfig: Object,
  },

  data() {
    return {
      map: null,
      mapStyle: '',
      // 树形控件默认映射
      defaultProps: {
        children: 'children',
        label: 'car_number'
      },
      // 查询表单
      dataForm: {
        searchValue: '',
      },
      // 轨迹回放表单
      pickerForm: {
        dataPicker: '',
      },
      // 轨迹视频
      moveAnimationVedioShow: false,
      // 轨迹回放是否展示
      moveAnimationShow: false,
      // 树形控件数据
      treeList: [],
      // 树形控件展示数据
      treeShowList: [],
      // 市级数据
      cityList: [],
      // 县级数据
      countyList: [],
      // 渣土车坐标
      carPointList: [],
      // 地图坐标点数据
      mapPointList: [],
      // 过滤后节点数据
      nodeList: [],

      _Amap: {},
      _map: {},
      _infoWindow: {},

      creatMaker: 0,
      mapMarkerData: '',
      videoUrl: 'https://video-qn.51miz.com/preview/video/00/00/15/00/V-150019-40B293DC.mp4',
      temp:[]
    }
  },

  computed: {
    // 正则校验
    dataRule () {
      // let validatePlate = (rule, value, callback) => {
      //   let regPlate = /^[京津冀晋蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼川贵云渝藏陕甘青宁新]{1}[ABCDEFGHJKLMNOPQRSTUVWXY]{1}[0-9A-Z]{5}$/u;
      //   if(value == '') {
      //     callback(new Error('车牌号不能为空'))
      //   } else if (value && !regPlate.test(value)) {
      //     callback(new Error('请输入正确的车牌号'))
      //   } else {
      //     callback()
      //   }
      // }
      // return {
      //   searchValue: [{ validator: validatePlate, trigger: 'blur'}],
      // }
      // return {
      //   searchValue: [{ required: true, message: '车牌号不能为空', trigger: 'blur'}],
      // }
    }
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
    
    let { mapWidth, mapHeight } = this.customConfig
    mapWidth = mapWidth ? `width: ${mapWidth};` : 'width: 100%;'
    mapHeight = mapHeight ? `height: ${mapHeight};` : 'height: 100%;'
    this.mapStyle = mapWidth + mapHeight

    this.getTreeDataList()

    window.checkAnimation = this.checkAnimation
    window.checkMonitor = this.checkMonitor
  },

  methods: {
    // 获取树形数据
    getTreeDataList() {
      let { assetId } = this.customConfig
      let { subAssetId } = this.customConfig
      
      assetId = assetId ? assetId : '8814ee94-13b1-5cfd-cc43-4beb208e4344'
      subAssetId = subAssetId ? subAssetId : '43335512-54ac-4770-cb09-17606e87690f'

      queryAssetById(assetId).then( (res1) => {
        queryAssetById(subAssetId).then( (res2) => {
          const nestParent = (items, data_id = null) => items.filter(item => item['parent_id'] == data_id).map(item => ({ ...item, children: nestParent(items, item.data_id) }));

          let parentTreeList = this.translatePlatformDataToJsonArray(res1)
          let chlidremTreeList = this.translatePlatformDataToJsonArray(res2)

          parentTreeList.forEach( (e) => {
            let lineAr = []
            chlidremTreeList.forEach( (i) => {
              if(i.parent_id == e.data_id) {
                lineAr.push(i)
                e.lineArr = lineAr
              }
            })
          })

          let treeList = nestParent(parentTreeList)

          this.treeList = treeList

          this.$nextTick( () => {
            // 生成假数据
            this.treeShowList = _.cloneDeep(this.treeList)
            // 修改节点名
            this.countCar(this.treeShowList)
            // 渣土车坐标置空
            this.carPointList = []
            // 生成渣土车坐标数组
            this.mapPointList = this.createDataList(this.treeShowList,2)
            // 生成地图
            this.initMap()
          })
        })
      })
    },

    // 数据转换
    translatePlatformDataToJsonArray(originTableData) {
      let originTableHeader = originTableData.data[0];
      let tableHeader = [];
      originTableHeader.forEach((item) => {
        tableHeader.push(item.col_name);
      });
      let tableBody = originTableData.data[1];
      let tableData = [];
      tableBody.forEach((tableItem) => {
        let temp = {};
        tableItem.forEach((item, index) => {
          temp[tableHeader[index]] = item;
        });
        tableData.push(temp);
      });
      return tableData;
    },

    // 生成地图
    initMap(map_x,map_y) {
      this.temp=[]

      this.moveAnimationShow = false
      this.moveAnimationVedioShow = false

      this.AMapLoader.load({
        "key": "4f9ebccb236519f688c2545d15e5242d",
        "version": "2.0",
        "plugins": [
          'AMap.Marker',
          'AMap.Icon',
          'AMap.Pixel',
          'AMap.Size',
          'AMap.InfoWindow',
          'AMap.Polyline',
          'AMap.moveAnimation'
        ]
      }).then( (AMap) => {
        let map = new AMap.Map(this.$refs['container'],{ zoom: 13, zooms:[9,18], center: [118.432581,32.423072]})
        let _this = this
        let markerList = []
        let titleIcon = require('./assets/carIcon.png')
        let trajectoryIcon = require('./assets/trajectory.png')
        let monitor = require('./assets/monitor.png')

        map.setCenter([map_x, map_y])

        // 创建坐标点图标
        let carIcon = new AMap.Icon({
          image: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
          imageSize: new AMap.Size(25, 34),
        });

        let i = -1
        let carPointList = this.mapPointList

        if(_this.creatMaker != 0) {
          carPointList.forEach( (e) => {
          let temp1 = []
          // 创建坐标点
          let marker = new AMap.Marker({
            icon: carIcon,
            position: [Number(e.map_x), Number(e.map_y)],
            offset: new AMap.Pixel(-13, -30)
          })
          i++
          temp1.push(e)
          // 创建信息弹窗内容
          let infoWindowContent = `<div class="map_infowindow">
              <div class="infowindow_title">
                <img src="${titleIcon}" />
                <div>${e.car_number ? e.car_number : ''}</div>
              </div>
              <div class="infowindow_info">
                <img src="${e.imgurl ? e.imgurl : ''}" />
                <div class="info_form">
                  <div>司机: ${e.driver ? e.driver : ''}</div>
                  <div>联系方式: ${e.phone ? e.phone : ''}</div>
                  <div>所属部门: ${e.department ? e.department : ''}</div>
                  <div>机架号: ${e.rackNumber ? e.rackNumber : ''}</div>
                  <div>车辆型号: ${e.carmModel ? e.carmModel : ''}</div>
                  <div>发动机型号: ${e.enginemodel ? e.enginemodel : ''}</div>
                </div>
              </div> 
              <div class="infowindow_bottom">
                <div class="infowindow_button" onclick="checkAnimation('${i}')">
                  <img src="${trajectoryIcon}" style="width: 18px;height: 18px;"/>
                  <div>轨迹查看</div>
                </div>
                <div class="infowindow_button" onclick="checkMonitor('${i}')" style="margin-left: 15px;">
                  <img src="${monitor}" />
                  <div>视频监控</div>
                </div>
              </div>
            </div>`
            // 创建信息弹窗
            let infoWindow = new AMap.InfoWindow({
              content: infoWindowContent,
              offset: new AMap.Pixel(0, -30)
            })
            temp1.push(infoWindow)

            _this.temp.push(temp1)
            
            // 添加坐标点
            markerList.push(marker)
            // 坐标点击事件
            marker.on('click', () => {
              infoWindow.open(map, [Number(e.map_x), Number(e.map_y)])
              _this.moveAnimationShow = false
              _this.moveAnimationVedioShow = false
            })
          })
          map.add(markerList)
        }

        _this.creatMaker = 1

        this._map = map
        this._Amap = AMap

      }).catch( (e) => {
        this.map = null
        this.initMap()
      })
    },

    // 关闭查看轨迹
    closeMoveAnimation() {
      this.moveAnimationShow = false
    },
    // 关闭视频
    closeMoveAnimationVedio() {
      this.moveAnimationVedioShow = false
    },

    // 播放轨迹
    startAnimation() {
      let e = this.temp[this.mapMarkerData][0]
      let map = this._map
      let AMap = this._Amap

      this.moveAnimationVedioShow = false

      e.lineArr.sort( (a,b) => {
        return a.car_time - b.car_time
      })

      if(e.lineArr) {
        let pointList = []
        e.lineArr.forEach( (e) => {
          if(this.pickerForm.dataPicker) {
            if(new Date(e.car_time) > this.pickerForm.dataPicker[0] && new Date(e.car_time) < this.pickerForm.dataPicker[1]) {
              pointList.push([Number(e.map_x), Number(e.map_y)])
            } else {
              pointList[0] = [Number(e.map_x), Number(e.map_y)]
            }
          } else {
            pointList.push([Number(e.map_x), Number(e.map_y)])
          }
        })
        
        AMap.plugin('AMap.MoveAnimation', function(){
          let lineMarker = new AMap.Marker({
            map: map,
            position: [Number(pointList[0][0]), Number(pointList[0][1])],
            icon: "https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png",
            offset: new AMap.Pixel(-13, -26),
          })
          let polyline = new AMap.Polyline({
            map: map,
            path: pointList,
            showDir:true,
            strokeColor: "#28F",
            strokeWeight: 6,
          })
          let passedPolyline = new AMap.Polyline({
            map: map,
            strokeColor: "#AF5",
            strokeWeight: 6,
          })
          lineMarker.on('moving', function (e) {
            passedPolyline.setPath(e.passedPath);
          })
          map.setFitView();
          setTimeout( () => {
            lineMarker.moveAlong(pointList, { duration: 500, autoRotation: true })
          },1000)
        })
      }
    },

    // 查看轨迹
    checkAnimation(data) {
      this.mapMarkerData = data
      this.moveAnimationShow = true
      this.pickerForm.dataPicker = []
      this.temp[this.mapMarkerData][1].close()
    },

    // 查看监控
    checkMonitor(data) {
      this.mapMarkerData = data
      this.moveAnimationVedioShow = true
      this.pickerForm.dataPicker = []
      this.temp[this.mapMarkerData][1].close()
      this.videoUrl = this.temp[this.mapMarkerData][0].videoUrl
    },

    // 过滤数据
    createDataList(data,level) {
      if(data.length) {
        data.forEach( (e) => {
          if(e.level != level) {
            this.createDataList(e.children,level)
          } else {
            level == 2 ? this.carPointList.push(e) : level == 1 ? this.countyList.push(e) : this.cityList.push(e)
          }
        })
      } else {
        level == 2 ? this.carPointList.push(data) : level == 1 ? this.countyList.push(data) : this.cityList.push(data)
      }
      return level == 2 ? this.carPointList : level == 1 ? this.countyList : this.cityList
    },

    // 自动计算车辆
    countCar(data) {
      data.forEach( (e) => {
        let num = 0
        e.children.forEach( (i) => {
          num += i.children.length
          i.car_number = i.car_number + `(${i.children.length}/${i.children.length})`
        })
        e.car_number = e.car_number + `(${num}/${num})`
      })
      return data
    },

    // 自动转大写
    inputChange(value) {
      this.$nextTick( () => {
        this.dataForm.searchValue = value.toUpperCase()
      })
    },

    // 查找车牌号
    searchLicensePlate() {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) return false
        if(this.dataForm.searchValue == '') {
          this.$refs.tree.filter('')
          this.carPointList = []
          this.mapPointList = this.createDataList(this.treeShowList,2)
          this.initMap()
          this.treeShowList = _.cloneDeep(this.treeList)
          this.countCar(this.treeShowList)
        } else {
          this.$refs.tree.filter(this.dataForm.searchValue)
          this.nodeList = []
          let pointList = this.createNodeList(this.$refs.tree.root)
          this.mapPointList = pointList
          this.initMap()
        }
      })
    },

    // 过滤节点
    filterNode(value, data) {
      if (!value) return true;
      return data.car_number.indexOf(value) !== -1;
    },

    // 过滤搜索节点数据
    createNodeList(data) {
      if(data.visible) {
        data.childNodes.forEach( (e) => {
          if(e.visible) {
            let numLengthE = 0
            e.childNodes.forEach( (i) => {
              if(i.visible) {
                let numLengthI = 0
                i.childNodes.forEach( (j) => {
                  if(j.visible) {
                    this.nodeList.push(j.data)

                    numLengthE++
                    numLengthI++

                    let cityName = e.data.car_number.substring(e.data.car_number.indexOf('('), e.data.car_number.indexOf('/'))
                    e.data.car_number = e.data.car_number.replace(cityName,`(${numLengthE}`)
                    
                    let countyName = i.data.car_number.substring(i.data.car_number.indexOf('('), i.data.car_number.indexOf('/'))
                    i.data.car_number = i.data.car_number.replace(countyName,`(${numLengthI}`)
                  }
                })
              }
            })
          }
        })
      }
      return this.nodeList
    },

    // 树形控件选中节点
    handleNodeClick(value) {
      if(value.level != 2) {
        this.dataForm.searchValue = ''
        this.$refs.tree.filter('')
        // this.treeShowList = [value]
        this.carPointList = []
        this.mapPointList = this.createDataList(this.treeShowList,2)
        this.initMap()
        this.treeShowList = _.cloneDeep(this.treeList)
        this.countCar(this.treeShowList)
      } else {
        let countyList = this.createDataList(this.treeShowList,1)
        let mapPointList = {}
        countyList.forEach( (e) => {
          if(e.data_id == value.parent_id) mapPointList = _.cloneDeep(e)
        })
        mapPointList.children = [value]

        this.carPointList = []
        this.mapPointList = this.createDataList([mapPointList],2)
        this.initMap(value.map_x,value.map_y)
      }
    },

    triggerEvent() {
      let { componentId, appId } = this.customConfig || {};
      componentId &&
        appId &&
        window.eventCenter?.triggerEventNew({
          objectId: appId,
          componentId: componentId,
          type: "app",
          event: "onImgClick",
          payload: {
            value: "sasdasd",
          },
        });
    },
    do_EventCenter_messageSuccess() {
      alert("动作执行成功！");
    },
    Event_Center_getName() {
      return "应用二开测试";
    },
  },

  destroyed() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  },
};
</script>

<style lang="less">
  // 去除地图logo
  .amap-logo, .amap-copyright{
	  display: none !important;
  }
  // 树地图整体
  .treeMap {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
  }
  // 树形控件
  .tree {
    width: 25%;
  }
  // 图标旋转
  .el-tree .el-tree-node__expand-icon.expanded {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  // 树形子节点未展开
  .el-tree .el-icon-caret-right:before {
    content: "+";
    display: block;
    width: 13px;
    height: 13px;
    font-size: 13px;
    color: #409eff;
    border: 1px solid #409eff;
    text-align: center;
    border-radius: 4px;
  }
  // 树形子节点展开
  .el-tree .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
    content: "-";
    display: block;
    width: 13px;
    height: 13px;
    font-size: 14px;
    color: #409eff;
    border: 1px solid #409eff;
    text-align: center;
    border-radius: 4px;
  }
  // 树形子节点最后一级
  .el-tree-node__expand-icon.is-leaf::before {
    content: "";
    display: block;
    text-align: center;
    border: none;
    background: url(./assets/car.png) no-repeat -1px -1px;
    background-size: 17px;
  }
  .amap-info-content {
    background-color: #31333F;
  }
  .amap-info-close {
    right: 15px !important;
    font: bold 19px/19px Tahoma,Verdana,sans-serif;
    color: #fff;
  }
  .map_infowindow {
    width: 400px;
  }
  .infowindow_title {
    color: #fff;
    font-size: 19px;
    display: flex;
    width: 100%;
    height: 100%;
    padding-bottom: 5px;
    border-bottom: 1px solid #41434F;
  }
  .infowindow_title img{
    width: 30px;
    height: 30px;
    margin: 0 6px;
  }
  .infowindow_info {
    display: flex;
    padding: 10px 0;
    border-bottom: 1px solid #41434F;
  }
  .infowindow_info img {
    padding: 0 10px 0 0;
    width: 130px;
    height: 110px;
  }
  .info_form {
    color: #fff;
    font-size: 13px;
  }
  .infowindow_bottom {
    display: flex;
    padding-top: 10px;
    color: #fff;
    font-size: 15px;
    width: 100%;
  }
  .infowindow_button {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .infowindow_bottom img {
    width: 20px;
    height: 20px;
    margin: 0 6px;
  }

  .colose_map {
    position: absolute;
    color: #fff;
    font-size: 20px;
    right: 20px;
    cursor: pointer;
  }
  .map_moveAnimation {
    position: absolute;
    margin-left: 60%;
    transform: translateX(-50%);
    bottom: 40px;
    width: 600px;
    text-align: center;
    background: #31333F;
    padding: 8px 15px;
  }
  .moveAnimation_vedio {
    width: 600px;
    height: 360px;
    margin-bottom: 100px;
  }
  .map_MoveAnimation_Video {
    width: 100%;
    height: 100%;

  }
  .vedio_none {
    height: 360px;
    line-height: 360px;
    color: #8E919A;
  }
  .moveAnimation_title {
    width: 100%;
    color: #fff;
    font-size: 17px;
    height: 35px;
    line-height: 35px;
    padding-bottom: 5px;
    border-bottom: 1px solid #fff;
  }
  .moveAnimation_info {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    padding-top: 20px;
  }
  .moveAnimation_picker {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .moveAnimation_picker .el-form-item {
    margin-bottom: 10px;
  }
  .moveAnimation_picker .el-date-editor {
    width: 100%;
  }
  .el-form-item__label {
    color: #fff;
  }
</style>