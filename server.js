// Root entry point for Render when Start Command is "node server.js"
// Runs the real server in the backend folder so paths and .env resolve correctly.
const { spawn } = require('child_process');
const path = require('path');

const backendDir = path.join(__dirname, 'backend');

const child = spawn('node', ['src/server.js'], {
  cwd: backendDir,
  stdio: 'inherit',
});

child.on('close', (code) => {
  process.exit(code ?? 0);
});

