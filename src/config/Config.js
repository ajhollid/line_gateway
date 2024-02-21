import yn from "yn";
import "dotenv/config";
import { HttpsProxyAgent } from "https-proxy-agent";
import TextUtils from "../utils/TextUtils.js";

let PROXY_AGENT;

if (process.env.PROXY_URL) {
  PROXY_AGENT = new HttpsProxyAgent(process.env.PROXY_URL);
  console.log(TextUtils.buildBoldLog("Proxy: " + process.env.PROXY_URL));
}

export default {
  PROXY_URL: process.env.PROXY_URL,
  REQUEST_URL: process.env.REQUEST_URL,
  ENABLE_TLS: yn(process.env.ENABLE_TLS),
  HTTPS_PORT: 8443,
  PORT: 8080,
  DEFAULT_LINE_TOKEN: process.env.DEFAULT_LINE_TOKEN,
  PROXY_AGENT,
};
