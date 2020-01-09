const Sequelize = require('sequelize');
const SESS_NAME = '_id';

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
        }
        if (data && data.length === 0) {
            data = {
                statusCode: 404,
                message: 'username or password was wrong'
            };
        }
    } else {
        data = {
            statusCode: 400,
            message: 'username or password was not defined'
        };
    }

    if (data && data.length && data.length > 0) {
        data = data[0];
        req.session._id = data.worker_id;
        res.status(200).json(data);
    } else {
        res.status(500).send('Something went wrong...');
    }
};
module.exports.afterLogin = function(req, res) {
    console.log(res.locals.user);
    res.status(200).send("It's ok!");
};

module.exports.auth = async function(req, res, next) {
    if (!req.session._id) {
        res.status(403).send('Forbidden');
    } else {
        try {
            const RESPONSE = await getUserInfo(
                req.sequelizers.admins,
                req.session._id
            );
            res.locals.user = RESPONSE && RESPONSE.length && RESPONSE[0];
        } catch (error) {
            console.log('[ERROR]:', error.message);
            res.status(505).send();
        }
        next();
    }
};

module.exports.authAdmin = async function(req, res, next) {
    if (!req.session._id) {
        res.status(403).send('Forbidden');
    } else {
        try {
            const RESPONSE = await getUserInfo(
                req.sequelizers.admins,
                req.session._id
            );

            const data = RESPONSE && RESPONSE.length && RESPONSE[0];
            const adminData = data.administrator && data.administrator.dataValues;
            if(adminData && typeof adminData.admin_id ==="number" && adminData.admin_id > 0)
            {
                res.locals.admin = data.administrators;
                res.locals.user = data;
                next();
            }else{
                res.status(403).send('Forbidden');
            }
        } catch (error) {
            console.log('[ERROR]:', error.message);
            res.status(505).send();
        }
    }
};


module.exports.logOut = function(req, res) {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500);
        }
        res.clearCookie(SESS_NAME);
        res.status(200);
    });
    res.send();
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
            const userAddress = await populateAddress(
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

async function getUserInfo(sequelize, usernameOrId, password) {
    let whereParams = {};
    password
        ? (whereParams = {
              username: usernameOrId,
              worker_password: password
          })
        : (whereParams = {
              worker_id: usernameOrId
          });

    return await sequelize.models.workers.findAll({
        include: [
            {
                model: sequelize.models.administrators
            },
            {
                model: sequelize.models.vets
            },
            {
                model: sequelize.models.caretakers
            },
            {
                model: sequelize.models.addresses
            }
        ],
        where: whereParams,
        limit: 1
    });
}

async function createAccount(model, user, key, value, t) {
        const { dataValues: createdAccount } = await model
        .create(
            {
                worker_id: user.worker_id,
                [key]: value
            },
            { transaction: t }
        )

    let idKey = Object.keys(createdAccount).find((key) => /_id/);

    return {
        ...user,
        [idKey]: createdAccount[idKey]
    };
}

async function createAccountType(sequelizer, accountInfo, user, t) {
    let key;
    let modelName;
    switch (accountInfo.type) {
        case 'admins':
        case 'administrators':
        case 'administrator':
        case 'admin':
            key = 'position';
            modelName = 'administrators';
            break;

        case 'caretaker':
        case 'caretakers':
            key = 'shift';
            modelName = 'caretakers';
            break;

        case 'vets':
        case 'vet':
            key = 'vet_specialty';
            modelName = 'vets';
            break;
    }
    const value = accountInfo[key];
    return (
        modelName &&
        key &&
        value &&
        (await createAccount(sequelizer.models[modelName], user, key, value, t))
    );
}
function isPasswordStrongEnough(pwd) {
    // at least one :
    // lowercase letter,
    // uppercase letter,
    // digit,
    // In length: 8
    return (
        pwd && pwd.match('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})') !== null
    );
}

async function isUsernameValid(sequelize, username) {
    username = username || '';
    const foundSameUsername = await sequelize.models.workers.findOne({
        where: { username }
    });
    if (foundSameUsername) {
        return {
            validationSuccess: false,
            message: 'User with given username already exists'
        };
    }
    return {
        validationSuccess: username.match('(?=.{5,})') !== null,
        message: 'Username is too short'
    };
}

async function populateAddress(sequelizer, addressInfo, t) {
    const userAddress = await sequelizer.models.addresses.findOne({
        where: addressInfo
    });

    if (!userAddress) {
        return await sequelizer.models.addresses.create(addressInfo, {
            transaction: t
        });
    }
    return userAddress;
}

module.exports.getAnimalHealth = async (req,res) => {
    const response = await req.sequelizers.vets.models.animal_health.findAll();
    const data = (response && response[0] && response[0].dataValues) || null;
    res.status(200).json(data);
}