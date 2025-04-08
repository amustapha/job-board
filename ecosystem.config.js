module.exports = {
  apps: [
    {
      name: "job-board",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: "500M",
      restart_delay: 100,
      exp_backoff_restart_delay: 100,
      watch: true,
      ignore_watch: [
        "node_modules",
        ".next",
        "logs",
        "*.log",
        "*.sqlite",
        "*.sqlite3",
        "*.db",
        "*.ts",
        "*.tsx",
      ],
      watch_options: {
        followSymlinks: false,
      },
    },
    {
      name: "job-updater",
      script: "node",
      args: "dist/scripts/index.js ",
      env: {
        NODE_ENV: "production",
      },
      cron_restart: "0 0 * * *", // Run at midnight every day
      autorestart: false,
      max_memory_restart: "500M",
      watch: true,
      ignore_watch: [
        "node_modules",
        ".next",
        "logs",
        "*.log",
        "*.sqlite",
        "*.sqlite3",
        "*.db",
        "*.ts",
        "*.tsx",
      ],
      watch_options: {
        followSymlinks: false,
      },
    },
  ],
};
