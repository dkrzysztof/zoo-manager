const Connection = require('./Connection');
const config = require('./rsrc.js');

async function start() {
    conn = new Connection();
    await conn.init(config);
    conn.setup();
}

start();
