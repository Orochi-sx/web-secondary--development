<template>
    <div>
       <!-- 资产ID -->
      <el-input v-model="form.assetId" size="small" placeholder="列表页"></el-input>
    </div>
</template>

<script>
// 引入接口
import { queryAssetById } from '../api/asset'

export default {
  name: 'List',
  props: {
    // 平台数据
    platformProps: Object,
    // 本地数据
    customConfig: Object
  },
  data() {
    return {
      // 配置项数据
      configForm: {
        assetId: ''
      }
    }
  },
  mounted() {
    // 配置项数据隔离
    if(this.platformProps) {
      this.configForm = this.platformProps.pluginConfig
    } else {
      this.configForm = this.customConfig.configuration
    }
  },
  methods: {

  },
};
</script>