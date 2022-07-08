#!/usr/bin/env node

const path = require("path");
var fs = require("fs-extra");
var glob = require("glob");
var AdmZip = require("adm-zip");

var yParser = require("yargs-parser");

const args = yParser(process.argv.slice(2));

const sourceMap = args.source || false;

function printZip(zip) {
  let zipEntries = zip.getEntries(); // an array of ZipEntry records
  zipEntries.forEach(function (zipEntry) {
    console.log(zipEntry.name || zipEntry.entryName); // outputs zip entries information
  });
}

// 删除老的文件
glob.sync(path.resolve(__dirname, "../pluginTemp/js/*")).map((file) => {
  console.log("file:", file);
  fs.removeSync(file);
});
glob.sync(path.resolve(__dirname, "../pluginTemp/media/*")).map((file) => {
  console.log("file:", file);
  fs.removeSync(file);
});
console.log("老文件已删除");

// copy js

let mainFileName = ""; // 主入口文件
glob.sync(path.resolve(__dirname, "../build/static/js/*")).map((file) => {
  let fileName = path.basename(file);
  if (path.extname(file) === ".js") {
    if (fileName.indexOf("main") > -1) {
      mainFileName = fileName;
    }
    fs.copySync(file, path.resolve(__dirname, `../pluginTemp/js/${fileName}`));
  } else {
    if (sourceMap)
      fs.copySync(
        file,
        path.resolve(__dirname, `../pluginTemp/js/${fileName}`)
      );
  }
});

// copy 静态文件
glob.sync(path.resolve(__dirname, "../build/static/media/*")).map((file) => {
  let fileName = path.basename(file);
  fs.copySync(file, path.resolve(__dirname, `../pluginTemp/media/${fileName}`));
});

console.log("新文件拷贝完成");

let configJson = require("../pluginTemp/config.json");

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
