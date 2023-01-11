// source https://stackoverflow.com/questions/60147499/how-to-set-port-in-next-js
// prod-server.js
require('dotenv').config(); // require dotenv
const cli = require('next/dist/cli/next-start');

cli.nextStart(['-p', process.env.PRODPORT || 3000]);