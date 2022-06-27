<template>
  <div class="app-list-nav">
    <div class="head-title">
      {{ title }}
    </div>
    <el-button class="head-button" ghost @click="goToStudy"> 跳转 </el-button>
    <div class="head-action" @click="trigger">
      <el-avatar :size="20" :src="imgUrl"></el-avatar>
    </div>
  </div>
</template>

<script>
// import appService from "@njsdata/app-sdk";
import eventActionDefine from "../components/msgCompConfig";
import "./index.css";
export default {
  name: "App",
  props: {
    customConfig: Object,
  },
  computed: {
    title() {
      return this.customConfig?.title || "数据构建";
    },
    imgUrl() {
      return (
        this.customConfig?.imgUrl ||
        "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png"
      );
    },
  },
  mounted() {
    let { componentId } = this.customConfig || {};
    componentId &&
      window.componentCenter?.register(
        componentId,
        "app",
        this,
        eventActionDefine
      );
  },
  methods: {
    goToStudy() {
      window.open(this.customConfig.url || "http://baidu.com");
    },
    // getData() {
    //   console.log(appService.getMenuData(), "菜单");
    //   console.log(appService.getPageData(), "页面");
    //   console.log(appService.getVariable(), "变量");
    // },
    trigger() {
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
      alert("二开菜单动作执行成功！");
    },
    Event_Center_getName() {
      return "应用二开菜单测试";
    },
  },
  destroyed() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  },
};
</script>
