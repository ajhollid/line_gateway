# LINE Notify Webhook Forwarder

### _Node Express server for forwarding Prometheus AlertManager alerts_

Provides a Node docker image running the included Express server.

This server listens for alert http POST requests from Prometheus Alert Manager, translates the request to be compliant with the [LINE Notify API](https://notify-bot.line.me/doc/en/) and forwards the request to the LINE Notify server.

#### Required Environemtal Variables

- LINE_TOKEN=&lt;Line Bearer Token&gt;

LINE token can be obtained at [LINE Notify Website](https://notify-bot.line.me/en/)

#### Optional Environmental Variables

- PORT=&lt;port&gt;

Server listens by default on port **3000**. Use the PORT environmental variable to specify a different port

## Getting Started

Use the supplied Dockerfile to create a docker image running the server. Be sure to specify the LINE_TOKEN environmental variable. Optionally specify a PORT environmental variable.

`docker run -e LINE_TOKEN=<token> <ServerImage>`

If you want to run the server without docker then run

`npm install`

followed by

`npm start`

![Screenshot](screenshot.png)
