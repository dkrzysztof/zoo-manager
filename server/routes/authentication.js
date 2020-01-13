module.exports.isPasswordStrongEnough = function(pwd) {
    // at least one :
    // lowercase letter,
    // uppercase letter,
    // digit,
    // In length: 8
    return (
        pwd && pwd.match('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})') !== null
    );
}

module.exports.getUserInfo = async function(sequelize, usernameOrWorkerId, password) {
    let whereParams = {};
    password
        ? (whereParams = {
              username: usernameOrWorkerId,
              worker_password: password
          })
        : (whereParams = {
              worker_id: usernameOrWorkerId
          });

    const userData = await sequelize.models.workers.findAll({
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

    if(userData && userData[0] && userData[0].dataValues){
        for(let key in userData[0].dataValues){
            if(!userData[0][key]){
                delete userData[0].dataValues[key];
                delete userData[0][key];
            }
        }
    }else {
     return userData;   
    }

    return userData[0];
}

module.exports.isUsernameValid = async function(sequelize, username) {
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

async function getUserAccountType(sequelize, usernameOrWorkerId){
    let whereParams = {};
    typeof usernameOrWorkerId === 'number'
        ? (whereParams = {
              worker_id: usernameOrWorkerId
          })
        : (whereParams = {
              username: usernameOrWorkerId
          });

    const userData = await sequelize.models.workers.findAll({
        include: [
            {
                model: sequelize.models.administrators,
                attributes: ['admin_id']
            },
            {
                model: sequelize.models.vets,
                attributes: ['vet_id']
            },
            {
                model: sequelize.models.caretakers,
                attributes: ['caretaker_id']
            }
        ],
        where: whereParams,
        attributes:[],
        limit: 1
    });

    if(userData && userData[0] && userData[0].dataValues){
        for(let key in userData[0].dataValues){
            if(!userData[0][key]){
                delete userData[0].dataValues[key];
                delete userData[0][key];
            }
        }
    }else {
     return userData;   
    }

    return userData[0];
}
module.exports.getUserAccountType = getUserAccountType;

module.exports.authAccountType = async function(req, res, next, accountType) {
    if (!req.session._id) {
        res.status(403).send('Forbidden');
    } else {
        try {
            const response = await getUserAccountType(req.sequelizers.admins,req.session._id);
            if(response[accountType]){
                next();
            }
            else {
                return res.status(403).send("Account access is forbidden.");
            }
        } catch (error) {
            console.log('[ERROR]:', error.message);
            res.status(505).send();
        }
    }
};