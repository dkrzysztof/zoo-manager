const admins_role = {user:"administrators" ,password:"role_admin"};
const caretakers_role = {user:"caretakers" ,password:"role_caretakers"};
const vets_role = {user:"vets" ,password:"role_vets"};
const guests_role = {user:"guests" ,password:"role_guests"};

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

