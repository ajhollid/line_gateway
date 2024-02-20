module.exports = {
  apps: [
    {
      name: "myapp",
      script: "./src/Server.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      // error_file: "/var/.pm2/logs/err.log",
      // out_file: "/var/.pm2/logs/out.log",
      // log_file: "/var/.pm2/logs//combined.log",
      time: true,
    },
  ],
};
