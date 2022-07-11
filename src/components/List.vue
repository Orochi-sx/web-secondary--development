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
    platformProps: Object,
    customConfig: Object
  },
  data() {
    return {
      form: {
        assetId: ''
      }
    }
  },
  mounted() {
    // 配置项信息
    if(this.platformProps) {
      this.form = this.platformProps.pluginConfig
    } else {
      this.form = this.customConfig.configuration
    }
  },
  methods: {

  },
};
</script>