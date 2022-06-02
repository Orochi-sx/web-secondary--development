<template>
  <div class="default_project">
    <van-radio-group v-model="radio">

        <div v-for="(item, index) in radioList" :key="index" class="project_label">
          <van-cell clickable @click="changeRadio(item)">
            
            <template #title>
              <van-radio :name="item[radioLabel]">{{ item[radioKey] }}</van-radio>
            </template>

            <template #right-icon>
              <van-button v-if="item[radioLabel] == defaultKey" round plain size="mini" type="info" class="default_button">默认项目</van-button>
            </template>

          </van-cell>
        </div>

    </van-radio-group>
    
    <div class="default_save" v-if="radioLabel && radioKey">
      <van-button round block size="small" type="info" class="save_button" @click="saveDefaultProject">保存</van-button>
    </div>
  </div>
</template>

<script>
// import appService from "@njsdata/app-sdk";
import eventActionDefine from "./components/msgCompConfig";
import "./index.css";

import { queryAssetById } from './api/asset'

export default {
  name: "App",

  props: {
    customConfig: Object,
  },

  data() {
    return {
      radio: '',
      radioList: [],
      defaultKey: '',
      radioLabel: '',
      radioKey: '',
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

    this.getRadioDataList()
  },

  methods: {
    getRadioDataList() {
      let { assetId } = this.customConfig

      let radioLabel = this.customConfig['存储字段']
      let radioKey = this.customConfig['显示字段']
      
      this.radioLabel = radioLabel ? JSON.parse(JSON.stringify(radioLabel)) : ''
      this.radioKey = radioKey ? JSON.parse(JSON.stringify(radioKey)) : ''

      queryAssetById(assetId).then( (res) => {
        this.radioList = this.translatePlatformDataToJsonArray(res)
        
        if(sessionStorage.getItem('hyy_default_project_key')) {
          let key = sessionStorage.getItem('hyy_default_project_key')
          this.radio = key.slice(key.indexOf(':') + 2)
          this.defaultKey = key.slice(key.indexOf(':') + 2)
        }

      }).catch( () => {} )
    },

    changeRadio(item) {
      console.log(item[this.radioLabel])
      this.radio = item[this.radioLabel]
      this.defaultKey = item[this.radioLabel]
    },

    saveDefaultProject() {
      
      window.hyy_default_project_key = `${this.customConfig['存储字段']}: ${this.radio}`

      sessionStorage.setItem('hyy_default_project_key',`${this.customConfig['存储字段']}: ${this.radio}`)

      this.$toast('保存成功')
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
    Event_Center_getName() {
      return "应用二开测试";
    },
  },
  destroyed() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
    sessionStorage.removeItem('hyy_default_project_key')
  },
};
</script>

<style>
  /* .default_project {
    background: #f1f1f1;
  } */
  .project_label {
    margin: 10px 0;
    padding: 0 10px;
  }
  .project_label .van-cell {
    padding: 11px 16px;
  }
  .default_save {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: .9375rem;
    height: 3.75rem;
  }
  .save_button {
    height: 2.3125rem !important;
    width: 80% !important;
  }
  .default_button {
    height: 20px !important;
    padding: 0 10px !important;
  }
</style>