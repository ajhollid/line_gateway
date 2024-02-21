module.exports = {
  apps: [
    {
      name: "LineGateway",
      script: "./src/Server.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      time: true,
    },
  ],
};
