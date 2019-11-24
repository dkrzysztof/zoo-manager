const { Client } = require('pg');

class Connection {
    constructor() {
        this.flagClose = false;
    }
    async fetchQueryResultWithError(query) {
        return new Promise((resolve, reject) => {
            if (typeof query === 'string') {
                return this.client.query(query, (err, res) => {
                    if (res) {
                        resolve(res);
                    }
                    if (err) {
                        console.log('ERROR', err.message);
                    }
                });
            } else {
                throw TypeError('query paramether should be a string!');
            }
        });
    }

    printQuerySelectResult(obj){
        
    }

    async init(config) {
        this.client = new Client(config);

        this.client
            .connect()
            .then(() => {
                console.log('Connected to server cluster...');
            })
            .catch((err) => {
                if (err) {
                    console.log('error connecting', err.message);
                }
            });
    }

    async setup() {
        let obj = await this.fetchQueryResultWithError(
            'SELECT datname FROM pg_database WHERE datistemplate = false;'
        );

        this.printQuerySelectResult(obj)
    }

    async close() {
        setTimeout(() => {
            if (this.flagClose) {
                this.close();
                console.log('doot');
            } else {
                console.log('Closing connection to server...');
                this.client.end();
                console.log('Connection closed');
            }
        }, 1000);
    }
}

module.exports = Connection;
