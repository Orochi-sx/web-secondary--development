#!/usr/bin/env node

const path = require("path");
var fs = require("fs-extra");
var glob = require("glob");
var AdmZip = require("adm-zip");

/**
 * str 应该是  xxx_1, xxx_2 的这种格式
 * @param {} str
 */
function versionAddOne(str, prefix) {
  let items = str.split("_");
  let version = parseInt(items[items.length - 1]);

  if (isNaN(version)) {
    version = 0;
  }

  items[items.length - 1] = version++;

  if (prefix) {
    return `${prefix}_${version}`;
  } else {
    return items.join("_");
  }
}

function printZip(zip) {
  let zipEntries = zip.getEntries(); // an array of ZipEntry records
  zipEntries.forEach(function (zipEntry) {
    console.log(zipEntry.name || zipEntry.entryName); // outputs zip entries information
  });
}

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// 删除老的文件
glob.sync(path.resolve(__dirname, "../pluginTemp/js/*")).map(file => {
  console.log("file:", file);
  fs.removeSync(file);
});
console.log("老文件已删除");

let files = glob.sync(path.resolve(__dirname, "../build/static/js/main.*.js"));
let jsScript = files[0];
console.log(jsScript);
let fileName = path.basename(jsScript);

fs.copySync(jsScript, path.resolve(__dirname, `../pluginTemp/js/${fileName}`));
console.log("新文件拷贝完成");

let configJson = require("../pluginTemp/config.json");
let packageJson = require("../package.json");

configJson.code = uuidv4();
configJson.name = versionAddOne(configJson.name, packageJson.name);
configJson.js_script = fileName;

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

printZip(zip);
console.log("打包完成...", pluginPath);
