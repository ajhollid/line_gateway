const path = require("path");
module.exports = {
  mode: "production",
  entry: "WebhookServer.js",
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "WebhookServer.js",
  },
  target: "node",
};
