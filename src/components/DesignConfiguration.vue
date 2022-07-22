<template>
  <el-form ref="form" :model="form" inline>
    <!-- 资产ID -->
    <el-form-item label="资产ID">
      <el-input v-model="form.assetId" size="small"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'DesignConfiguration',
  props: {
    // 平台数据
    customConfig: Object,
    // 本地数据
    platformProps: Object
  },
  data() {
    return {
      // 配置项数据
      configForm: {
        assetId: "",
      },
    }
  },
  mounted() {
    // 配置项数据隔离
    if(this.platformProps) {
      this.configForm = JSON.parse(this.platformProps.configuration)
    } else {
      this.configForm = this.customConfig.configuration
    }
  },
  watch: {
    "form.assetId": function (value, oldValue) {
      this.onFormLayoutChange();
    },
  },
  methods: {
    onFormLayoutChange() {
      this.platformProps?.changeConfiguration(JSON.stringify(this.form));
    }
  },
};
</script>