const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const routes = require("./routes");
const Sequelize = require("sequelize");
const loadModels = require("../models");
const logger = require("./rsrc/logger");

const SESS_NAME = "_id";

class Server {
    constructor() {
        this.expressApp = require("express")();
    }

    async _setupSequelizers(config) {
        // initiating empty sequlizers holder
        this.sequelizers = {};

        await this._setupSequelize(
            this.sequelizers,
            "admins",
            config,
            config.admins.user,
            config.admins.password
        );
        await this._setupSequelize(
            this.sequelizers,
            "caretakers",
            config,
            config.caretakers.user,
            config.caretakers.password
        );
        await this._setupSequelize(
            this.sequelizers,
            "vets",
            config,
            config.vets.user,
            config.vets.password
        );
        // await this._setupSequelize(
        //     this.sequelizers,
        //     'guests',
        //     config,
        //     config.guests.user,
        //     config.guests.password
        // );
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
            console.log("[SEQUELIZE]: Connected!");

            // load models made from sequelize-auto
            await loadModels(sequelize, sequlizeName);
            console.log(
                "[SEQUELIZE]: Successfuly loaded models for " +
                    sequlizeName.toUpperCase()
            );
        } catch (error) {
            console.error("[SEQUELIZE]: ERROR", error.message);
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
        this.expressApp.get("/", routes.hello);

        this.expressApp.post("/login", routes.logIn);
        this.expressApp.get("/logout", routes.logOut);

        this.expressApp.get("/home", routes.auth, routes.hello);
        this.expressApp.post(
            "/users",
            routes.auth,
            routes.authAdmin,
            routes.createUser
        );
        this.expressApp.put("/users", routes.auth, routes.updateUserProfile);

        this.expressApp.post(
            "/vet-visits",
            routes.auth,
            routes.authCaretakerOrVet,
            routes.createVisit
        );
        this.expressApp.put(
            "/vet-visits/:id",
            routes.auth,
            routes.authCaretaker,
            routes.updateVisit
        );
        this.expressApp.put(
            "/vet-visits/vet/:id",
            routes.auth,
            routes.authVet,
            routes.updateFinishedVisitStatus
        );
        this.expressApp.delete(
            "/vet-visits/vet/:id",
            routes.auth,
            routes.authVet,
            routes.deleteVisit
        );
        this.expressApp.get(
            "/vet-visits/vet/",
            routes.auth,
            routes.authVet,
            routes.getAllVisitsByVetID
        );
        this.expressApp.get(
            "/vet-visits/vet/",
            routes.auth,
            routes.authVet,
            routes.getAllVisitsByVetID
        );

        this.expressApp.post(
            "/animals/",
            routes.auth,
            routes.authCaretaker,
            routes.createAnimalProfile
        );
        this.expressApp.get(
            "/animals/vet/:id",
            routes.auth,
            routes.authVet,
            routes.getAnimalsHealth
        );
        this.expressApp.put(
            "/animals/vet/:id",
            routes.auth,
            routes.authVet,
            routes.updateAnimalsHealth
        );

        this._setupEnumGetters(this.expressApp);
    }

    _setupMiddlewares() {
        this.expressApp.use(cors());
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
            session({
                name: SESS_NAME,
                resave: false,
                cookie: {
                    maxAge: 1000 * 60 * 60 * 2,
                    sameSite: true,
                    // SECURE MUST TRUE IN PRODUCTION!!!
                    secure: false
                },
                saveUninitialized: false,
                secret: "topsecret"
            })
        );
        this.expressApp.use(logger);
    }

    _setupEnumGetters(expressApp) {
        const enums = [
            {
                // poprawic na ENG
                url: "/administrators/positions",
                enum: "enum_administrators_position"
            },
            {
                // poprawic na ENG
                url: "/animals-places/conditions",
                enum: "enum_animal_places_condition"
            },
            {
                // poprawic na 5 scale degree
                url: "/animal/health-conditions",
                enum: "enum_animals_health"
            },
            {
                url: "/caretakers/shifts",
                enum: "enum_caretakers_shift"
            },
            {
                // poprawić na jednoczesciowe napisy
                url: "/vet-visits/states",
                enum: "enum_vet_visits_visit_state"
            },
            {
                // poprawic na ENG
                url: "/vets/specialties",
                enum: "enum_vets_vet_specialty"
            }
        ];

        for (let obj of enums) {
            expressApp.get(obj.url, async function(req, res) {
                const data = await routes.getEnumValues(
                    req.sequelizers.admins,
                    obj.enum
                );
                res.status(400).json(data);
            });
        }
    }
}

module.exports = Server;
