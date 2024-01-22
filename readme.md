# LINE Notify Gateway

### _Node Express server for forwarding Prometheus AlertManager alerts_

Provides a Node docker image running the included Express server.

This server listens for alert http POST requests from Prometheus Alert Manager, translates the request to be compliant with the [LINE Notify API](https://notify-bot.line.me/doc/en/) and forwards the request to the LINE Notify server.

## Getting Started

You can run this project in several ways

##### Docker Image

Use the supplied Dockerfile to create a docker image running the server. Be sure to specify the LINE_TOKEN environmental variable. Optionally specify a PORT environmental variable.

```
docker build -t <ImageName> .
docker run
```

---

##### Direct Install in Node Environment

1.  Complete the configuration in `config.yaml`
2.  Run `npm install` to install packages
3.  Run `npm start` to start server

---

##### Sample Alert Configuration

```
webhook_configs:
  - url: <gateway_server_url>
    http_config:
      authorization:
        type: Bearer
        credentials_file: <path_to_credential_file>
```

---

![Screenshot](screenshot.png)
