import yn from "yn";
import "dotenv/config";
import TextUtils from "../utils/TextUtils.js";
import AppConfig from "../model/AppConfig.js";

if (process.env.PROXY_URL) {
  console.log(TextUtils.buildBoldLog("Proxy: " + process.env.PROXY_URL));
}

const APP_CONFIG: AppConfig = {
  PROXY_URL: process.env.PROXY_URL,
  REQUEST_URL: process.env.REQUEST_URL,
  ENABLE_TLS: yn(process.env.ENABLE_TLS),
  HTTPS_PORT: 8443,
  PORT: 8080,
  DEFAULT_LINE_TOKEN: process.env.DEFAULT_LINE_TOKEN,
};

export default APP_CONFIG;
