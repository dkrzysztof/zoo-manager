const helmet = require('helmet');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const routes = require('./routes');
const Sequelize = require('sequelize');
const loadModels = require('../models');
const logger = require('./rsrc/logger');

class Server {
    constructor() {
        this.expressApp = require('express')();
    }

    async _setupSequelizers(config) {
        // initiating empty sequlizers holder
        this.sequelizers = {};

        await this._setupSequelize(
            this.sequelizers,
            'admins',
            config,
            config.admins.user,
            config.admins.password
        );
        await this._setupSequelize(
            this.sequelizers,
            'caretakers',
            config,
            config.caretakers.user,
            config.caretakers.password
        );
        await this._setupSequelize(
            this.sequelizers,
            'vets',
            config,
            config.vets.user,
            config.vets.password
        );
        await this._setupSequelize(
            this.sequelizers,
            'guests',
            config,
            config.guests.user,
            config.guests.password
        );
    }

    async _setupSequelize(holder, sequlizeName, config, user, password) {
        // create new database connection object
        let sequelize = new Sequelize(
            config.database,
            user,
            password,
            config.options
        );

        // append name of the sequelizer
        sequelize.name = sequlizeName;

        //autheticate credentials and connect
        try {
            await sequelize.authenticate();
            console.log('[SEQUELIZE]: Connected!');

            // load models made from sequelize-auto
            await loadModels(sequelize, sequlizeName);
            console.log(
                '[SEQUELIZE]: Successfuly loaded models for ' +
                    sequlizeName.toUpperCase()
            );
        } catch (error) {
            console.error('[SEQUELIZE]: ERROR', error.message);
        }

        // link sequelize to this context
        holder[sequlizeName] = sequelize;
    }

    async start(port, config) {
        await this._setupSequelizers(config);
        this._setupMiddlewares();
        this._setupRoutes();
        this.expressApp.listen(port, () => {
            console.log(`Listening on port ${port}...`);
        });
    }

    _setupRoutes() {
        this.expressApp.get('/', routes.hello);
        this.expressApp.post('/login', routes.logIn);
        this.expressApp.post('/users/', routes.createUser);
    }

    _setupMiddlewares() {
        this.expressApp.use(helmet());
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(bodyParser.urlencoded({ extended: true }));
        // this.expressApp.use(cookieParser());
        this.expressApp.use((req, res, next) => {
            req.sequelizers = {
                admins: this.sequelizers.admins,
                caretakers: this.sequelizers.caretakers,
                vets: this.sequelizers.vets,
                guest: this.sequelizers.guest
            };
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
        this.expressApp.use(logger);
    }
}

module.exports = Server;
