import Config from "../config/Config.js";
import fetch from "node-fetch";
import HttpStatus from "http-status-codes";
import { HttpsProxyAgent } from "https-proxy-agent";
import ServerException from "../model/ServerException.js";
const MESSAGE_ERROR = "Message is required";
// ********************
// Create a POST config for fetch
// Uses proxy if specified
// ********************
const createConfig = (form, token, appConfig) => {
  const config = {
    method: "POST",
    body: form,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  if (appConfig.PROXY_URL) {
    config.agent = new HttpsProxyAgent(appConfig.PROXY_URL);
  }
  return config;
};

const createForm = (message) => {
  if (!message) {
    throw new ServerException(HttpStatus.BAD_REQUEST, MESSAGE_ERROR);
  }
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
    const postConfig = createConfig(form, token, Config);
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

export default { createConfig, createForm, postToLineServer, MESSAGE_ERROR };
