# LINE Notify Webhook Forwarder

### _Node Express server for forwarding Prometheus AlertManager alerts_

Provides a Node docker image running the included Express server

#### Required Environemtal Variables

- LINE_TOKEN=&lt;Line Bearer Token&gt;

LINE token can be obtained at [LINE Notify Website](https://notify-bot.line.me/en/)

#### Optional Environmental Variables

- PORT=&lt;port&gt;

Server listens by default on port **3000**. Use the PORT environmental variable to specify a different port
