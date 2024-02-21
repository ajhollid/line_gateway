import Config from "../config/Config.js";
import fetch from "node-fetch";

// ********************
// Create a POST config for fetch
// Uses proxy if specified
// ********************
const createConfig = (form, token) => {
  const config = {
    method: "POST",
    body: form,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  if (Config.PROXY_AGENT) {
    config.agent = Config.PROXY_AGENT;
  }
  return config;
};

const createForm = (message) => {
  const form = new FormData();
  form.append("message", message);
  return form;
};

// ********************
// Maps each message to a fetch request
// ********************
const mapMessagesToRequests = async (messages, token) => {
  return messages.map(async (message) => {
    const form = createForm(message);
    const postConfig = createConfig(form, token);
    const response = await fetch(Config.REQUEST_URL, postConfig);
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (err) {
      return text;
    }
  });
};

// ********************
// Send all messages
// ********************
const postToLineServer = async (messages, token) => {
  const requests = await mapMessagesToRequests(messages, token);
  return Promise.all(requests);
};

export default { postToLineServer };
