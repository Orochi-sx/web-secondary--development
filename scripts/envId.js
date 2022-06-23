const fs = require("fs");
const path = require("path");

let configJson = require("../pluginTemp/config.json");

function generateUUID() {
  var d = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};
configJson.id = generateUUID();
let customPluginId = configJson.id;
fs.writeFileSync(
  path.resolve(__dirname, "../pluginTemp/config.json"),
  JSON.stringify(configJson, null, 2),
  "utf8"
);

fs.writeFileSync(
  path.resolve(__dirname, "../.env"),
  `VUE_APP_CUSTOM_PLUGIN_ID=${customPluginId}`,
  "utf8"
);
