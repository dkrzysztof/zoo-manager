const Server = require('./server');
const config = require('./config.js');

async function start() {
    server = new Server();
    await server.start(3000, config);

    process.on('uncaughtException', function(err) {
        console.log('[Uncaught ERROR]]: ' + err.message);
    });
}

start();
