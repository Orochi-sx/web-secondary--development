<template>
  <div>
    <div class="contentBox" ref="contentBox">
      <div v-for="ol of boxNum" :key="ol" class="itemBox" :ref="'itemBox' + ol">
        <div v-for="(item, index) in content" class="detail" :ref="'detail' + ol + index" :key="index">{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dataSource: {
      type: Array,
      default: () => [],
    },
    componentId: {
      type: String | undefined,
      default: "",
    },
    options: {
      type: Object,
      default: () => ({
        // 配置项从externalVariables里取
        externalVariables: {},
      }),
    },
    updateProcess: {
      type: Function,
      default: () => { },
    },
  },
  data() {
    return {
      fontSize: '',
      rowSpace: 0,
      color: '',
      contentSize: [],
      rotate: '',
      content: [],
      boxNum: 0,
      showField: '',
      arr2: []
    };
  },

  mounted() {
    const { fontSize, rowSpace, color, contentSize, rotate, showField } = this.options.externalVariables
    this.fontSize = fontSize + 'px',
      this.rowSpace = rowSpace,
      this.color = color,
      this.contentSize = contentSize.split(','),
      this.rotate = rotate
    this.showField = showField.split(',')
    console.log('this.showField',this.showField);
    this.init()

    this.componentId &&
      window.componentCenter?.register &&
      window.componentCenter.register(this.componentId, "comp", this, {
        events,
        actions,
      });
    this.updateProcess && this.updateProcess();
  },
  methods: {
    init() {
      console.log('window.localtion.href', window.location.href)
      let url = window.location.href ||"https://www.baidu.com?data1=123&data2=456&data3=789"
      let str = ''
      let newArr = []
      console.log('111', url.indexOf('?'));
      if (url.indexOf('?')) {
        str = url.split('?')[1]
        console.log('str==', str);
        if (str.indexOf('&')) {
          newArr = str.split('&')
        }
      }
      console.log('newArr==', newArr);
      newArr.forEach(item => {
        let arr = []
        arr = item.split('=')
        if (this.showField.indexOf(arr[0]) !== -1 && arr[1] !== '') {
          this.arr2.push(`${arr[1]}`)
        }
      })
      console.log('arr2==', this.arr2);
      // let flagArr = ['data1', 'data2', 'data3']

      // console.log('flagArr==',flagArr);
      // this.content = flagArr.length == 0 ? ['data1', 'data2', 'data3'] : flagArr
      this.content = this.arr2

      let width = this.$refs.contentBox.offsetWidth
      let height = this.$refs.contentBox.offsetHeight
      let area = width * height
      let boxArea = this.contentSize[0] * this.contentSize[1]
      this.boxNum = Math.ceil(area / boxArea);
      this.$nextTick(() => {
        for (let i = 1; i < this.boxNum + 1; i++) {
          let name = 'itemBox' + i
          this.$refs[name][0].style.color = this.color//颜色透明度
          this.$refs[name][0].style.fontSize = this.fontSize//字号大小设置
          this.$refs[name][0].style.width = this.contentSize[0] + 'px'//文字块宽设置
          this.$refs[name][0].style.height = this.contentSize[1] + 'px'//文字块高设置
          this.$refs[name][0].style.transform = `rotate(${this.rotate}deg)`//文字旋转角度设置
          for (let j = 0; j < this.content.length; j++) {
            let contentName = 'detail' + i + j
            this.$refs[contentName][0].style.marginBottom = this.rowSpace + 'px'//文字行间距设置
          }
        }
      })
    },
    // 逻辑控制用，不可删，return内容可改
    Event_Center_getName: () => {
      return "大屏水印";
    },
    do_EventCenter_messageSuccess(param) {
      console.log(param);
      alert("动作执行成功！");
    },
  },
};
</script>
<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.contentBox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  overflow-y: hidden;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
}

.itemBox {
  margin-bottom: 50px;
  margin-left: 200px;
}

.detail {
  width: 100%;
  font-family: 'Microsoft YaHei';
}
</style>
