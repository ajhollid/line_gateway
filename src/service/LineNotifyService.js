import Config from "../config/Config.js";
import fetch from "node-fetch";
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

    if (Config.PROXY_AGENT) {
      config.agent = Config.PROXY_AGENT;
    }
    return fetch(Config.REQUEST_URL, config).then((response) =>
      response.json()
    );
  });
};

const postToLineServer = (messages, token) => {
  const requests = mapMessagesToRequests(messages, token);
  return Promise.all(requests);
};

export default { postToLineServer };
