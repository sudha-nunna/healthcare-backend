// Root entry point for Render (when Start Command is "node server.js")
// Switches to backend dir so dotenv and relative paths resolve correctly
const path = require('path');
process.chdir(path.join(__dirname, 'backend'));
require(path.join(__dirname, 'backend', 'src', 'server.js'));
