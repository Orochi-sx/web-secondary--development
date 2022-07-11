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
    customConfig: Object,
    platformProps: Object
  },
  data() {
    return {
      form: {
        assetId: "",
      },
    }
  },
  mounted() {
    // 配置项信息
    if(this.platformProps) {
      this.form = JSON.parse(this.platformProps.configuration)
    } else {
      this.form = this.customConfig.configuration
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