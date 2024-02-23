import Config from "../config/Config.js";
import fetch, { Response } from "node-fetch";
import HttpStatus from "http-status-codes";
import { HttpsProxyAgent } from "https-proxy-agent";
import ServerException from "../model/ServerException.js";
import AppConfig from "../model/AppConfig";
import RequestConfig from "../model/RequestConfig.js";
const MESSAGE_ERROR = "Message is required";
// ********************
// Create a POST config for fetch
// Uses proxy if specified
// ********************
const createConfig = (
  form: FormData,
  token: string,
  appConfig: AppConfig
): RequestConfig => {
  const config: RequestConfig = {
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

const createForm = (message: string): FormData => {
  if (!message) {
    throw new ServerException(HttpStatus.BAD_REQUEST, MESSAGE_ERROR, null);
  }
  const form: FormData = new FormData();
  form.append("message", message);
  return form;
};

// ********************
// Maps each message to a fetch request
// ********************
const mapMessagesToRequests = async (
  messages: Array<string>,
  token: string
): Promise<(string | object)[]> => {
  return messages.map(async (message) => {
    const form: FormData = createForm(message);
    const postConfig: RequestConfig = createConfig(form, token, Config);
    const response: Response = await fetch(Config.REQUEST_URL, postConfig);
    const text: string = await response.text();
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
const postToLineServer = async (
  messages: Array<string>,
  token: string
): Promise<(string | object)[]> => {
  if (!Array.isArray(messages)) {
    throw new ServerException(
      HttpStatus.BAD_REQUEST,
      "Messages must be an array"
    );
  }

  if (messages.length === 0) {
    throw new ServerException(
      HttpStatus.BAD_REQUEST,
      "Messages must not be empty"
    );
  }
  const requests = await mapMessagesToRequests(messages, token);
  return Promise.all(requests);
};

export default {
  createConfig,
  createForm,
  postToLineServer,
  mapMessagesToRequests,
  MESSAGE_ERROR,
};
