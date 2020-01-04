const Seq = require('sequelize');

module.exports.hello = async function(req, res) {
    res.status(200).json({
        code: 200,
        message: 'hello!'
    });
};
module.exports.logIn = async function(req, res) {
    let data;

    if (req.body.username && req.body.password) {
        data = await req.sequelizers.admins.models.workers
            .findAll({
                include: [
                    {
                        model: req.sequelizers.admins.models.administrators
                    },
                    {
                        model: req.sequelizers.admins.models.vets
                    },
                    {
                        model: req.sequelizers.admins.models.caretakers
                    },
                    {
                        model: req.sequelizers.admins.models.addresses
                    }
                ],
                where: {
                    username: req.body.username,
                    worker_password: req.body.password
                },
                limit: 1
            })
            .catch((err) => {
                console.log(
                    'ERROR :',
                    'there was an error while retrieving logIn credentials\n',
                    err.message
                );
            });

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
    }
    res.status(400).json(data);
};

module.exports.createUser = async function(req, res) {
    const data = await req.sequelizers.admins.models.workers.findOne({
        where: { username: req.body.username },
        attributes: ['worker_id']
    });

    const existingUser = data && data.dataValues && data.dataValues.worker_id;
    if (existingUser) {
        res.status(400).send('User with given username already exists');
        return;
    }

    const {
        username,
        worker_password,
        firstname,
        lastname,
        phonenumber,
        street,
        building_number,
        city,
        post_code,
        country
    } = req.body;

    const flat_number = req.body.flat_number || null;

    const addressInfo = {
        street,
        building_number,
        flat_number,
        city,
        post_code,
        country
    };

    const workerInfo = { worker_password, firstname, lastname, phonenumber };

    const populateAddress = async () => {
        const userAddress = await req.sequelizers.admins.models.addresses.findOne(
            {
                where: addressInfo
            }
        );

        if (!userAddress) {
            return await req.sequelizers.admins.models.addresses.create(
                addressInfo
            );
        }
        return userAddress;
    };

    const userAddress = await populateAddress();

    const [
        dbUser,
        wasUserCreated
    ] = await req.sequelizers.admins.models.workers.findOrCreate({
        where: { username },
        defaults: { ...workerInfo, address_id: userAddress.address_id }
    });

    if (!wasUserCreated) {
        res.status(418).send('User with given username already exists');
    } else {
        res.status(200).json(dbUser);
    }
};
