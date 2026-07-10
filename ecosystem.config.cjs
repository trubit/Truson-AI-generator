module.exports = {
  apps: [
    {
      name: 'neurova-backend',
      script: './server/src/server.ts',
      interpreter: 'node',
      interpreter_args: '--import tsx',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
      max_memory_restart: '1G',
      error_file: './server/src/logs/pm2-error.log',
      out_file: './server/src/logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      autorestart: true,
      watch: false,
    }
  ]
};
