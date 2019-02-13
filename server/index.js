const LDNServer = require('./src/ldn-server');

const server = new LDNServer(start=true, port=process.env.PORT);