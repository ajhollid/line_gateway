import { HttpsProxyAgent } from "https-proxy-agent";
import { buildBoldLog } from "./TextUtils.js";
const REQUEST_URL = process.env.REQUEST_URL;

//Configure proxy agent if it is specified
let PROXY_AGENT;
if (process.env.PROXY_URL) {
  PROXY_AGENT = new HttpsProxyAgent(process.env.PROXY_URL);
  console.log(buildBoldLog("Proxy: " + process.env.PROXY_URL));
}

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

    return fetch(REQUEST_URL, config)
      .then((response) => response.text())
      .then((body) => {
        console.log(buildBoldLog("Success: " + body));
        return "Success: " + body;
      })
      .catch((err) => {
        console.error(buildBoldLog("Error: " + err.message));
        return "Error: " + err.message;
      });
  });
};

const postToLineServer = (res, messages, token) => {
  // Map all messages to requests
  const requests = mapMessagesToRequests(messages, token);

  // Send all the requests
  return Promise.all(requests).then((results) => {
    res.send(results);
  });
};

export default { postToLineServer };
