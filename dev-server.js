// source https://stackoverflow.com/questions/60147499/how-to-set-port-in-next-js
// dev-server.js
require('dotenv').config(); // require dotenv
const cli = require('next/dist/cli/next-dev');

cli.nextDev(['-p', process.env.PORT || 3000]);