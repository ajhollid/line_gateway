import { HttpsProxyAgent } from "https-proxy-agent";
import TextUtils from "../utils/TextUtils.js";
import Config from "../config/Config.js";

//Configure proxy agent if it is specified
let PROXY_AGENT;

const setupProxyAgent = () => {
  if (Config.PROXY_URL) {
    PROXY_AGENT = new HttpsProxyAgent(Config.PROXY_URL);
    console.log(TextUtils.buildBoldLog("Proxy: " + Config.PROXY_URL));
  }
};

const mapMessagesToRequests = (messages, token) => {
  return messages.map((message) => {
    const form = new FormData();
    form.append("message", message);

    const config = {
      method: "POST",
      body: form,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    if (PROXY_AGENT) {
      config.agent = PROXY_AGENT;
    }
    return fetch(Config.REQUEST_URL, config).then((response) =>
      response.json()
    );
  });
};

const postToLineServer = (messages, token) => {
  setupProxyAgent();
  const requests = mapMessagesToRequests(messages, token);
  return Promise.all(requests);
};

export default { postToLineServer };
