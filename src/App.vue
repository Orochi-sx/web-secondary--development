<template>
  <component :is="componentType" :platformProps="platformProps" :customConfig="customConfig" />
</template>

<script>
import List from "./components/List.vue"
import DesignConfiguration from "./components/DesignConfiguration.vue";

export default {
  name: "App",
  props: {
    type: String,
    platformProps: Object,
    customConfig: Object
  },
  components: {
    List,
    DesignConfiguration,
  },
  computed: {
    componentType: function () {
      if(this.type) {
        return this.type?.slice(0, 1).toUpperCase() + this.type?.slice(1);
      } else {
        return this.platformProps.type.slice(0, 1).toUpperCase() + this.platformProps.type.slice(1);
      }
    },
  },
};
</script>
