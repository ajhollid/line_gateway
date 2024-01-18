# LINE Notify Webhook Forwarder

### Node Express server for forwarding Prometheus AlertManager alerts

Provides a Node docker image running the included Express server

#### Required Environemtal Variables

- LINE_TOKEN=&lt;Line Bearer Token&gt;

LINE token can be obtained at [LINE Notify Website](https://notify-bot.line.me/en/)

#### Optional Environmental Variables

- PORT=&lt;port&gt;

Optionally specify a port, default port is **3000**
