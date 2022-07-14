import { defineConfig } from "dumi";
import path from "path";

const host = "http://10.15.111.9:12892"; // 本地Demo后台地址

export default defineConfig({
  title: "sdata-plugins",
  favicon:
    "https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png",
  outputPath: "docs-dist",
  mode: "site",
  resolve: {
    includes: ["docs"],
  },
  proxy: {
    "/sdata/rest": {
      // 大部分路由
      target: host,
      // router: () => host,
      secure: false,
      logLevel: "info",
    },
    "/sdata/ext": {
      // 部分二开接口
      target: host,
      // router: () => host,
      secure: false,
      logLevel: "info",
    },
    "/storage_area": {
      // 资源接口
      target: host,
      // router: () => host,
      secure: false,
      logLevel: "info",
    },
  },
});
