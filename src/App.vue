<template>
  <div class="main">
    <el-card
      shadow="hover"
      v-for="(item, index) of stationData"
      :key="index"
      class="singleCard"
    >
      <div class="infoTop">
        <span>{{ item.propertiesName }}</span>
        <a>查看数据</a>
      </div>
      <div class="infoCenter">
        <span>{{ item.identifierValue + " " }}</span>

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
      :page-sizes="[10, 20, 30, 50]"
      :page-size="limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tatal"
      class="pagination"
    >
    </el-pagination>
  </div>
</template>

<script>
// import appService from "@njsdata/app-sdk";
import eventActionDefine from "./components/msgCompConfig";
import { queryDeviceModelData } from "./api/asset";
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
      limit: 10,
      page: 1,
    };
  },
  computed: {},
  mounted() {
    let { componentId } = this.customConfig || {};
    componentId &&
      window.componentCenter?.register(
        componentId,
        "comp",
        this,
        eventActionDefine
      );
    let message = {
      deviceId: "6b8e430d8be44b18af2d6c3123313688",
      productId: "a2024d5c-6491-49e1-a37b-cb42d1d3bd7b",
    };
    queryDeviceModelData(message).then((res) => {
      this.stationList = res.data;
      this.tatal = res.data?.length;
      this.pageList();
    });
  },
  methods: {
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
    // 具体分页操作
    pageList() {
      this.stationData = this.stationList.filter(
        (item, index) =>
          index < this.page * this.limit &&
          index >= this.limit * (this.page - 1)
      );
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
    span {
      font-size: 32px;
      font-weight: 600;
    }
    .unit {
      vertical-align: super;
      font-weight: 500;
      color: black;
      cursor: default;
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
</style>