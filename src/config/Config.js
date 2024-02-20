import yn from "yn";
import "dotenv/config";

export default {
  REQUEST_URL: process.env.REQUEST_URL,
  ENABLE_TLS: yn(process.env.ENABLE_TLS),
  HTTPS_PORT: 8443,
  PORT: 8080,
  DEFAULT_LINE_TOKEN: process.env.DEFAULT_LINE_TOKEN,
};
