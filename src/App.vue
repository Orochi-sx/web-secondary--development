<template>
  <div class="main">
    <el-empty style="width: 100%" description="暂无数据" v-if="stationData.length == 0"></el-empty>
    <el-card shadow="hover" v-for="(item, index) of stationData" :key="index" class="singleCard" @click.native="showDialog(item)">
      <div class="infoTop">
        <span>{{ item.propertiesName }}</span>
        <a @click.stop="goLink(item)">查看数据</a>
      </div>
      <div class="infoCenter">
        <div>
          <el-tooltip class="item" effect="dark" :content="item.identifierValue" placement="top-start">
            <span>{{ item.identifierValue + " " }}</span>
          </el-tooltip>
        </div>

        <a class="unit">{{ item.unitSymbol }}</a>
      </div>
      <div class="infoBottom">
        <span>
          {{ item.createTime }}
        </span>
      </div>
    </el-card>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="pasgesize"
      :page-size="limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tatal"
      class="pagination"
    >
    </el-pagination>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="1000px" :before-close="handleCloseDialog">
      <img :src="imgSrc" alt="" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import appService from "@njsdata/app-sdk";
import eventActionDefine from "./components/msgCompConfig";
import { queryDeviceModelData, queryWarnPicture } from "./api/asset";
import "./index.css";
export default {
  name: "App",
  props: {
    customConfig: Object,
    info: Object,
  },
  data() {
    return {
      stationData: [],
      stationList: [],
      tatal: 0,
      limit: 0,
      page: 1,
      pasgesize: [],
      dialogVisible: false,
      dialogTitle: "弹窗",
      imgSrc: "",
    };
  },
  computed: {},
  mounted() {
    console.log(this.customConfig);
    this.pasgesize = this.customConfig?.page ? JSON.parse(this.customConfig?.page) : [8, 16, 32];
    this.limit = this.pasgesize[0];
    let { componentId } = this.customConfig || {};
    componentId && window.componentCenter?.register(componentId, "comp", this, eventActionDefine);
    let message = {
      // deviceId: "f8270e5d2c5c48e29bc68a6991759b44",
      // productId: "3b03640f-b8ad-4a08-aa96-e98341f72eda",
      deviceId: this.getUrlParams(window.location.href).deviceId,
      productId: this.getUrlParams(window.location.href).productId,
    };
    queryDeviceModelData(message).then((res) => {
      this.stationList = res.data;
      this.tatal = res.data?.length;
      this.pageList();
    });
  },
  methods: {
    getUrlParams(url) {
      // 通过 ? 分割获取后面的参数字符串
      let urlStr = url.split("?")[1];
      // 创建空对象存储参数
      let obj = {};
      // 再通过 & 将每一个参数单独分割出来
      let paramsArr = urlStr.split("&");
      for (let i = 0, len = paramsArr.length; i < len; i++) {
        // 再通过 = 将每一个参数分割为 key:value 的形式
        let arr = paramsArr[i].split("=");
        obj[arr[0]] = arr[1];
      }
      return obj;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.limit = val;
      this.pageList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.pageList();
    },
    showDialog(item) {
      if (item.requestFlag == 1) {
        let message = {
          deviceId: item.deviceId,
          eventId: item.identifierValue,
        };
        queryWarnPicture(message).then((res) => {
          this.imgSrc = res.data.picUrl;
          this.dialogVisible = true;
        });
      }
    },
    goLink(item) {
      if (this.customConfig.url参数) {
        window.open(
          `${window.location.origin}${window.location.pathname}?${this.customConfig.url参数}&deviceId=${item.deviceId}&productId=${item.productId}&identifier=${item.identifier}`,
          "_blank"
        );
      }
    },
    handleCloseDialog(done) {
      done();
    },
    // 具体分页操作
    pageList() {
      this.stationData = this.stationList.filter((item, index) => index < this.page * this.limit && index >= this.limit * (this.page - 1));
      this.total = this.stationData.length;
    },
  },
  destroyed() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  },
};
</script>
<style lang="less" scoped>
.main {
  // height: 100%;
  background: #f5f5f5;
  display: flex;
  flex-wrap: wrap;
}
.singleCard {
  height: 160px;
  width: 300px;
  background: #fff;
  margin: 15px;
  .infoTop {
    height: 30%;
    display: flex;
    justify-content: space-between;
    margin: 15px 15px 0px 15px;
    a {
      color: #6380c6;
      cursor: pointer;
      &:hover {
        color: #4169e1;
      }
    }
  }
  .infoCenter {
    height: 40%;
    margin: 0px 15px 0px 15px;
    display: flex;
    justify-content: start;
    div {
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
    }
    span {
      font-size: 32px;
      font-weight: 600;
    }
    .unit {
      font-weight: 500;
      color: black;
      cursor: default;
      margin-top: 10px;
      margin-left: 2px;
    }
  }
  .infoBottom {
    height: 30%;
    margin: 0px 15px 0px 15px;
    span {
      color: #808080;
    }
  }
}
/deep/.el-card__body {
  height: 160px;
  width: 300px;
  padding: 0 0px 0 0px;
}
.is-hover-shadow:hover {
  box-shadow: 5px 5px 12px 0 rgb(0 0 0 / 25%);
}
.pagination {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}
img {
  height: 100%;
  width: 100%;
}
</style>
