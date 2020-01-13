const { addAddress: populateAddressToDatabase } = require("./routes/addAddress");

const {getUserInfo, isPasswordStrongEnough, isUsernameValid, authAccountType} = require('./routes/authentication');

const {createAccount, createAccountType} = require('./routes/createUser')

const SESS_NAME = '_id';
const WORKER_TABLE_CARETAKER_FIELD = 'caretaker';
const WORKER_TABLE_ADMINISTRATOR_FIELD = 'administrator';
const WORKER_TABLE_VET_FIELD = 'vet';

module.exports.hello = async function(req, res) {
    res.status(200).json({
        code: 200,
        message: 'hello!'
    });
};

module.exports.logIn = async function(req, res) {
    let data;
    const { username, password } = req.body;

    if (username && password) {
        try {
            data = await getUserInfo(
                req.sequelizers.admins,
                username,
                password
            );
        } catch (error) {
            console.log('[ERROR]:', error.message);
            return res.status(400).send(error.message);
        }
    } else {
        return res.status(400).send('username or password was not defined');
    }
    
    if (data && data.dataValues) {
        req.session._id = data.worker_id;
        return res.status(200).json(data);
    } else {
        return res.status(400).send('username or password was wrong');
    }
};

module.exports.auth = async function(req, res, next) {
    if (!req.session._id) {
        res.status(403).send('Forbidden');
    } else {
        try {
            res.locals.user = await getUserInfo(
                req.sequelizers.admins,
                req.session._id
            );
        } catch (error) {
            console.log('[ERROR]:', error.message);
            res.status(505).send();
        }
        next();
    }
};

module.exports.authVet = async function(req, res, next) {
    await authAccountType(req,res,next,WORKER_TABLE_VET_FIELD);
};

module.exports.authCaretaker = async function(req, res, next) {
    await authAccountType(req,res,next,WORKER_TABLE_CARETAKER_FIELD);
};

module.exports.authAdmin = async function(req, res, next) {
    await authAccountType(req,res,next,WORKER_TABLE_ADMINISTRATOR_FIELD);

};

module.exports.createUser = async function(req, res) {
    
    req.sequelizers.admins
        .transaction({ autocommit: false })
        .then(async (t) => {
            const {
                username,
                password: worker_password,
                addressInfo,
                workerInfo,
                accountInfo
            } = req.body;

            addressInfo.post_code = addressInfo.post_code || addressInfo.postCode;
            delete addressInfo.postCode;

            addressInfo.building_number = addressInfo.building_number|| addressInfo.buildingNumber,
            delete addressInfo.buildingNumber;
            
            addressInfo.flat_number = addressInfo.flat_number || addressInfo.flatNumber,
            delete addressInfo.flatNumber;

            workerInfo.phonenumber = workerInfo.phonenumber || workerInfo.phoneNumber
            delete workerInfo.phoneNumber   ;

            if (!(accountInfo && accountInfo.type)) {
                res.status(400).send(
                    'AccountInfo or its values cannot be Null!'
                );
                return;
            }
            if (
                !(
                    workerInfo &&
                    workerInfo.firstname &&
                    workerInfo.lastname &&
                    workerInfo.phonenumber
                )
            ) {
                res.status(400).send(
                    'WorkerInfo or its values cannot be Null!'
                );
                return;
            }

            if (
                !(
                    addressInfo &&
                    addressInfo.street &&
                    addressInfo.building_number &&
                    addressInfo.city &&
                    addressInfo.post_code &&
                    addressInfo.country
                )
            ) {
                res.status(400).send(
                    'AddressInfo or its values cannot be Null!'
                );
                return;
            }
            // password length verfication
            const passwordIsStrong = await isPasswordStrongEnough(
                worker_password
            );
            if (!passwordIsStrong) {
                res.status(400).send(
                    'Password is  too weak. At least one \nlowercase letter,\n uppercase letter,\n digit.\n In length: 8.'
                );
                return;
            }

            // username validation
            const validationResponse = await isUsernameValid(
                req.sequelizers.admins,
                username
            );
            if (!validationResponse.validationSuccess) {
                res.status(400).send(validationResponse.message);
                return;
            }

            // address population
            const userAddress = await populateAddressToDatabase(
                req.sequelizers.admins,
                addressInfo,
                t
            );

            // creating user with unique username only
            const [
                dbUser,
                wasUserCreated
            ] = await req.sequelizers.admins.models.workers.findOrCreate({
                where: { username },
                defaults: {
                    ...workerInfo,
                    worker_password,
                    address_id: userAddress.address_id
                },
                transaction: t
            });

            if (!wasUserCreated) {
                res.status(418).send('User with given username already exists');
                t.rollback();
            } else {

                try {
                                    const response = await createAccountType(
                    req.sequelizers.admins,
                    accountInfo,
                    dbUser.dataValues,
                    t
                );
                
                if (response) {
                    res.status(200).json(response);
                    await t.commit();
                    return;
                }
                res.status(400).send(
                    'Wrongly assigned account type or object keys. Something might have been mispelled.'
                    );
                    await t.rollback();
                } catch (error) {
                    console.log("[ERROR]:",error.message);  
                    res.status(500).send(error.message); 
                }
            }
        });
};

module.exports.logOut = function(req, res) {

    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('OK');
        }
        res.clearCookie(SESS_NAME);
        return res.status(200).send('OK');
    });
};

module.exports.getEnumValues = async function getEnumValues(
    sequelize,
    enumName
) {
    const [queryResponseObject] = await sequelize.query(
        `Select enum_range(NULL::${enumName});`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );

    return queryResponseObject && queryResponseObject.enum_range;
};

module.exports.getAnimalHealth = async (req,res) => {
    const vet_id = res.locals.user
    const response = await req.sequelizers.vets.models.animal_health.findAll({where: {vet_id}});
    const data = (response && response[0] && response[0].dataValues) || null;
    res.status(200).json(data);
}

module.exports.updateUserProfile = async (req,res) => {
    const newProfileData = req.body;

    const isPasswordStrong = await isPasswordStrongEnough(newProfileData.password);

    if(!isPasswordStrongEnough && newProfileData.password){
        return res.status(400).send("New password is not strong enough.");
    }

    const user = res.locals.user;

    for(let key in user.dataValues){
        switch (key) {
            case "administrator":
                for(let key in user.administrator.dataValues){
                    if(!['worker_id','admin_id'].some(x=> x===key)){
                        user.administrator[key] = newProfileData[key] || user.administrator.dataValues[key];
                    }
                }
            break;
            case "caretaker":
                for(let key in user.caretaker.dataValues){
                    if(!['worker_id','caretaker_id'].some(x=> x===key)){
                        user.caretaker[key] = newProfileData[key] || user.caretaker.dataValues[key];
                    }
                }
            break;
            case "vet":
                for(let key in user.vet.dataValues){
                    if(!['worker_id','vet_id'].some(x=> x===key)){
                        user.vet[key] = newProfileData[key] || user.vet.dataValues[key];
                    }
                }
            break;
            case "username":
                break;
            default:
                user[key] = newProfileData[key] || user.dataValues[key];
                break;
        }
    }

    try {
        user.vet && typeof user.vet.save === "function" ? await user.vet.save() : undefined;
        user.caretaker && typeof user.caretaker.save === "function" ? await user.caretaker.save() : undefined;
        user.administrator && typeof user.administrator.save === "function" ? await user.administrator.save() : undefined;
        await user.save();

    } catch (error) {
        console.log("[ERROR]:",error.message);
        return res.status(400).send(error.message);
    }    

    res.status(200).send("OK");
}


module.exports.createVisit = function(req,res){

    const {
        vet_id,animal_id,visit_date
    } = req.body;
    const newVisit = {
        vet_id,animal_id,visit_date: new Date(visit_date)
    }

    try {
        const RESPONSE = req.sequelizers.vets.models.vet_visits.create({
            ...newVisit,
            description:"",
            visit_date: "pending"
        });
        res.status(200).json(RESPONSE);
    } catch (error) {
        console.log('[ERROR at createVisit]:',error.message);
        res.status(500).send();
    }
}