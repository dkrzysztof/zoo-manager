const helmet = require('helmet');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const routes = require('./routes');
const Sequelize = require('sequelize');
const loadModels = require('../models');

class Server {
    constructor() {
        this.expressApp = require('express')();
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

    async start(port, config) {
        // create new database connection object
        this.sequelize = new Sequelize(
            config.database,
            config.user,
            config.password,
            {
                host: config.host,
                dialect: 'postgres',
                port: config.port,
                define: {
                    timestamps: false
                },
                logging: false
            }
        );

        //autheticate credentials and connect
        await this.sequelize
            .authenticate()
            .then(() => {
                console.log('[SEQUELIZE]: Connected!');
                return true;
            })
            .catch((err) => {
                console.error('[SEQUELIZE]: ERROR', err.message);
                return false;
            });

        // load models made from sequelize-auto
        await loadModels(this.sequelize);

        this._setupMiddlewares();
        this._setupRoutes();
        await this.expressApp.listen(port, () => {
            console.log(`Listening on port ${port}...`);
        });
    }

    _setupRoutes() {
        this.expressApp.post('/login', routes.logIn);
    }

    _setupMiddlewares() {
        this.expressApp.use(helmet());
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(bodyParser.urlencoded({ extended: true }));
        // this.expressApp.use(cookieParser());
        this.expressApp.use((req, res, next) => {
            req.server = { sequelize: this.sequelize };
            next();
        });
        this.expressApp.use(
            expressSession({
                name: 'session.id',
                // SECURE MUST TRUE IN PRODUCTION!!!
                key: 'zoo.ssid',
                secure: false,
                saveUninitialized: false,
                expires: new Date().setMinutes(new Date().setSeconds + 30),
                resave: false,
                secret: 'topsecret'
            })
        );
    }
}

module.exports = Server;
