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

You can run this project in several ways

##### Docker Image

Use the supplied Dockerfile to create a docker image running the server. Be sure to specify the LINE_TOKEN environmental variable. Optionally specify a PORT environmental variable.

    `docker build -t <ImageName> .`
    `docker run -e LINE_TOKEN=<token> <ImageName`

---

##### Kubernetes Deployment

Use the docker image generated above in a Kubernetes deployment. Sample configuration:

```
kind: Deployment
apiVersion: apps/v1
metadata:
  name: webhook-forwarder-deployment
  namespace: default

spec:
  replicas: 1
  selector:
    matchLabels:
      app: webhook-forwarder
  template:
    metadata:
      labels:
        app: webhook-forwarder
    spec:
      containers:
        - name: container
          image: <WebhookDockerImage>
          ports:
            - name: http
              containerPort: 3000
              protocol: TCP
          env:
            - name: LINE_TOKEN
              value: <LINE_TOKEN>
```

---

##### Direct Install in Node Environment

1.  Create `.env` file with required environmental variables
2.  Run `npm install` to install packages
3.  Run `npm start` to start server

---

![Screenshot](screenshot.png)
