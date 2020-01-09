
module.exports = {
    database: "zoodatabase",
    options:{
        host:"localhost",
        port: "5432",
        dialect: "postgres",
        logging: false,
        define:{
            timestamps:false
        }
    },
    admins: admins_role,
    caretakers: caretakers_role,
    vets: vets_role,
    guests: guests_role
}

