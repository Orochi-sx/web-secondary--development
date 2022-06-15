#!/usr/bin/env node

const path = require("path");
const fs = require("fs-extra");
const glob = require("glob");
const AdmZip = require("adm-zip");

function printZip(zip) {
  let zipEntries = zip.getEntries(); // an array of ZipEntry records
  zipEntries.forEach(function(zipEntry) {
    console.log(zipEntry.name || zipEntry.entryName); // outputs zip entries information
  });
}
let configJson = require("../pluginTemp/config.json");
// 删除老的文件
glob.sync(path.resolve(__dirname, "../pluginTemp/js/*")).map(file => {
  console.log("file:", file);
  fs.removeSync(file);
});
console.log("老文件已删除");

// copy js

let files = glob.sync(path.resolve(__dirname, "../dist/js/app.*.js"));
let jsScript = files[0];
let mainFileName = path.basename(jsScript);

// copy 静态文件
fs.copySync(
  jsScript,
  path.resolve(__dirname, `../pluginTemp/js/${mainFileName}`)
);
console.log("新文件拷贝完成");

configJson.main = mainFileName;

fs.writeFileSync(
  path.resolve(__dirname, "../pluginTemp/config.json"),
  JSON.stringify(configJson, null, 2),
  "utf8"
);

console.log("config.json 修改完成", configJson);

console.log("打包中...");

let zip = new AdmZip();
zip.addLocalFolder(path.resolve(__dirname, "../pluginTemp"));
let pluginPath = path.resolve(
  __dirname,
  `../plugin-${new Date().getTime()}.zip`
);
zip.writeZip(pluginPath);
fs.writeFileSync(path.resolve(__dirname, "../temp"), pluginPath, "utf-8");
printZip(zip);
console.log("打包完成...", pluginPath);
