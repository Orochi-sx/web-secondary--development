<template>
  <div class="drag-container">
    <div class="slider">
      <div class="cpn" draggable="true" @dragstart="ondragstart" id="组件 1">组件 1</div>
      <div class="cpn" draggable="true" @dragstart="ondragstart" id="组件 2">组件 2</div>
    </div>
    <div class="ctn-box">
      <div class="inner-box" @dragover.prevent="" @drop.stop="ondrop" id="模板框 1"></div>
      <div class="inner-box" @dragover.prevent="" @drop.stop="ondrop" id="模板框 2"></div>
    </div>
  </div>
</template>

<script>
// import appService from "@njsdata/app-sdk";
import eventActionDefine from "./components/msgCompConfig";
import "./index.css";
export default {
  name: "App",
  props: {
    customConfig: Object,
    info: Object,
  },
  computed: {
    title() {
      return this.customConfig?.title || "数据构建";
    },
    desc() {
      return this.customConfig?.desc || "描述";
    },
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
  },
  methods: {
    ondragstart(e) {
      const id = e.target.getAttribute('id')
      console.log('ondragstart', id)
    },
    ondrop(e) {
      const id = e.target.getAttribute('id')
      console.log('drop', id)
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


<style lang="less" scoped>
.drag-container {
  height: 100%;
  display: flex;

  .slider {
    height: 100%;
    width: 48%;
    padding: 20px;
    background-color: #b0b0b0;

    .cpn {
      width: 100px;
      text-align: center;
      font-size: 18px;
      line-height: 40px;
      background-color: #cacdca;
      margin-bottom: 10px;
    }
  }

  .ctn-box {
    height: 100%;
    width: 48%;
    padding: 20px;
    background-color: #ccc;

    .inner-box {
      width: 100%;
      height: 49%;
      margin-bottom: 10px;
      background-color: #777777;
    }

  }
}
</style>