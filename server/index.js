const LDNServer = require('./src/server');

const server = new LDNServer(start=true, port=process.env.PORT);