const moment = require('moment');

const { checkIfVetIsFreeOnDate, getVisitsByVetId } = require('./routes/vets');
const {
    addAddress: populateAddressToDatabase,
} = require('./routes/addAddress');
const {
    getUserInfo,
    isPasswordStrongEnough,
    isUsernameValid,
    authAccountType,
} = require('./routes/authentication');
const { createAccount, createAccountType } = require('./routes/createUser');

const SESS_NAME = '_id';
const WORKER_TABLE_CARETAKER_FIELD = 'caretaker';
const WORKER_TABLE_ADMINISTRATOR_FIELD = 'administrator';
const WORKER_TABLE_VET_FIELD = 'vet';

const VET_VISIT_TIMESTAMP_COLUMN_NAME = 'visit_date';
const VET_VISIT_VET_ID = 'vet_id';

module.exports.hello = async function(req, res) {
    res.status(200).json({
        code: 200,
        message: 'hello!',
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
    await authAccountType(req, res, next, [WORKER_TABLE_VET_FIELD]);
};

module.exports.authCaretaker = async function(req, res, next) {
    await authAccountType(req, res, next, [WORKER_TABLE_CARETAKER_FIELD]);
};

module.exports.authCaretakerOrVet = async function(req, res, next) {
    await authAccountType(req, res, next, [
        WORKER_TABLE_CARETAKER_FIELD,
        WORKER_TABLE_VET_FIELD,
    ]);
};

module.exports.authAdmin = async function(req, res, next) {
    await authAccountType(req, res, next, [WORKER_TABLE_ADMINISTRATOR_FIELD]);
};

module.exports.createUser = async function(req, res) {
    req.sequelizers.admins
        .transaction({ autocommit: false })
        .then(async t => {
            const {
                username,
                password: worker_password,
                addressInfo,
                workerInfo,
                accountInfo,
            } = req.body;

            addressInfo.post_code =
                addressInfo.post_code || addressInfo.postCode;
            delete addressInfo.postCode;

            (addressInfo.building_number =
                addressInfo.building_number || addressInfo.buildingNumber),
                delete addressInfo.buildingNumber;

            (addressInfo.flat_number =
                addressInfo.flat_number || addressInfo.flatNumber),
                delete addressInfo.flatNumber;

            workerInfo.phonenumber =
                workerInfo.phonenumber || workerInfo.phoneNumber;
            delete workerInfo.phoneNumber;

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

            if (!addressInfo.flat_number || addressInfo.flat_number === '') {
                delete addressInfo.flat_number;
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
                wasUserCreated,
            ] = await req.sequelizers.admins.models.workers.findOrCreate({
                where: { username },
                defaults: {
                    ...workerInfo,
                    worker_password,
                    address_id: userAddress.address_id,
                },
                transaction: t,
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
                    console.log('[ERROR]:', error.message);
                    res.status(500).send(error.message);
                }
            }
        })
        .catch(err => {
            console.log('[ERROR]:', err.message);
            res.send(400);
        });
};

module.exports.deleteUserProfile = async function(req, res) {
    req.sequelizers.admins.transaction({ autocommit: false }).then(async t => {
        const userID = req.params.id;

        const userProfileToDelete = await getUserInfo(
            req.sequelizers.admins,
            userID
        );

        const countWr = (
            await req.sequelizers.admins.models.workers.count({
                where: {
                    address_id: userProfileToDelete.dataValues.address_id,
                },
                group: ['worker_id'],
                raw: true,
            })
        ).length;

        const countAn = (
            await req.sequelizers.admins.models.animals.count({
                where: {
                    address_id: userProfileToDelete.dataValues.address_id,
                },
                group: ['animal_id'],
                raw: true,
            })
        ).length;

        try {
            // prettier-ignore
            const deletedAdminsAccounts = await req.sequelizers.admins.models.administrators.destroy({where: {worker_id: userProfileToDelete.worker_id}, transaction: t});
            // prettier-ignore
            const deletedVetVisits = await req.sequelizers.admins.models.vet_visits.destroy({where: {vet_id: userProfileToDelete.vet.dataValues.vet_id}, transaction: t});
            // prettier-ignore
            const deletedVetsAccounts = await req.sequelizers.admins.models.vets.destroy({where: {worker_id: userProfileToDelete.worker_id}, transaction: t});
            // prettier-ignore
            const deletedCaretakersAccounts = await req.sequelizers.admins.models.caretakers.destroy({where: {worker_id: userProfileToDelete.worker_id}, transaction: t});
            // prettier-ignore
            let deletedWorkersAccounts = await userProfileToDelete.destroy({transaction:t});

            if (countAn === 0 && countWr === 1) {
                const response = await req.sequelizers.admins.models.addresses.destroy(
                    {
                        where: {
                            address_id:
                                userProfileToDelete.dataValues.address_id,
                        },
                        transaction: t,
                    }
                );

                console.log('response at destroy', response);
            }

            typeof deletedWorkersAccounts === 'object'
                ? (deletedWorkersAccounts = 1)
                : undefined;

            const responseObject = {
                deletedAdminsAccounts,
                deletedVetVisits,
                deletedVetsAccounts,
                deletedCaretakersAccounts,
                deletedWorkersAccounts,
            };

            t.commit();
            res.status(200).json(responseObject);
        } catch (error) {
            console.log('[ERROR]:', error.message);
            t.rollback();
            res.status(500).send(error.message);
        }
    });
};

module.exports.logOut = function(req, res) {
    req.session.destroy(err => {
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
            type: sequelize.QueryTypes.SELECT,
        }
    );

    return queryResponseObject && queryResponseObject.enum_range;
};

module.exports.updateUserProfile = async (req, res) => {
    const newProfileData = req.body;

    const isPasswordStrong = await isPasswordStrongEnough(
        newProfileData.password
    );

    if (!isPasswordStrongEnough && newProfileData.password) {
        return res.status(400).send('New password is not strong enough.');
    }

    const user = res.locals.user;

    for (let key in user.dataValues) {
        switch (key) {
            case 'administrator':
                for (let key in user.administrator.dataValues) {
                    if (!['worker_id', 'admin_id'].some(x => x === key)) {
                        user.administrator[key] =
                            newProfileData[key] ||
                            user.administrator.dataValues[key];
                    }
                }
                break;
            case 'caretaker':
                for (let key in user.caretaker.dataValues) {
                    if (!['worker_id', 'caretaker_id'].some(x => x === key)) {
                        user.caretaker[key] =
                            newProfileData[key] ||
                            user.caretaker.dataValues[key];
                    }
                }
                break;
            case 'vet':
                for (let key in user.vet.dataValues) {
                    if (!['worker_id', 'vet_id'].some(x => x === key)) {
                        user.vet[key] =
                            newProfileData[key] || user.vet.dataValues[key];
                    }
                }
                break;
            case 'username':
                break;
            default:
                user[key] = newProfileData[key] || user.dataValues[key];
                break;
        }
    }

    try {
        user.vet && typeof user.vet.save === 'function'
            ? await user.vet.save()
            : undefined;
        user.caretaker && typeof user.caretaker.save === 'function'
            ? await user.caretaker.save()
            : undefined;
        user.administrator && typeof user.administrator.save === 'function'
            ? await user.administrator.save()
            : undefined;
        await user.save();
    } catch (error) {
        console.log('[ERROR]:', error.message);
        return res.status(400).send(error.message);
    }

    res.status(200).send('OK');
};

module.exports.createVisit = async function(req, res) {
    const { vet_id, animal_id, visit_date, description } = req.body;

    const newVisit = {
        vet_id,
        animal_id,
        description,
    };

    if (
        !(
            vet_id &&
            animal_id &&
            visit_date &&
            visit_date.year &&
            visit_date.month &&
            visit_date.day &&
            visit_date.hour
        )
    ) {
        return res.status(400).send('Incomplete data');
    }

    const visitDate = new Date(
        visit_date.year,
        visit_date.month,
        visit_date.day,
        visit_date.hour
    );

    if (visitDate.getHours() < 8 || visitDate.getHours() > 16) {
        return res
            .status(400)
            .send('Vets works between 8-16, you gave ' + visitDate.getHours());
    }

    const isFree = await checkIfVetIsFreeOnDate(
        req.sequelizers.vets,
        vet_id,
        visitDate
    );

    if (!isFree) {
        return res.status(400)
            .send(`There already is an appointment for vet:${vet_id} 
        on time ${visitDate.toLocaleTimeString()}, ${visitDate.toLocaleDateString()}`);
    }

    try {
        const RESPONSE = await req.sequelizers.vets.models.vet_visits.create({
            ...newVisit,
            visit_date: visitDate.toISOString(),
            visit_state: 'pending',
        });

        res.status(200).json(RESPONSE);
    } catch (error) {
        console.log('[ERROR at createVisit]:', error.message);
        res.status(500).send();
    }
    return;
};

module.exports.updateVisit = async function(req, res) {
    const { visit_date } = req.body;

    const newVisitData = {
        visit_date,
    };

    if (
        !(
            visit_date &&
            visit_date.year &&
            visit_date.month &&
            visit_date.day &&
            visit_date.hour
        )
    ) {
        return res.status(400).send('Incomplete data');
    }

    const foundVisit = await req.sequelizers.vets.models.vet_visits.findOne({
        where: { visit_id: req.params.id },
    });
    const newVisitDate = new Date(
        visit_date.year,
        visit_date.month,
        visit_date.day,
        visit_date.hour
    );

    if (foundVisit) {
        for (let key in foundVisit.dataValues) {
            if (key === VET_VISIT_TIMESTAMP_COLUMN_NAME) {
                const isFree = await checkIfVetIsFreeOnDate(
                    req.sequelizers.vets,
                    newVisitDate
                );

                if (isFree) {
                    foundVisit[key] = newVisitDate.toISOString();
                } else {
                    return res.status(400).send('Visit date is not available.');
                }
            }
            if (key === VET_VISIT_VET_ID) {
                const exists = await req.sequelizers.vets.models.vets.findOne({
                    where: {
                        [VET_VISIT_VET_ID]: newVisitData[VET_VISIT_VET_ID],
                    },
                });
                if (exists) {
                    foundVisit[key] = newVisitData[key] || foundVisit[key];
                } else {
                    return res
                        .status(400)
                        .send('No such an Id for vet exists.');
                }
            }
        }

        const response = await foundVisit.save();
        res.status(200).json(response);
    } else {
        res.status(400).send('There was not such a visit.');
    }
};

module.exports.updateFinishedVisitStatus = async function(req, res) {
    const vetID = res.locals.user.vet.vet_id;

    const visitById = await req.sequelizers.vets.models.vet_visits.findOne({
        where: { visit_id: req.params.id },
    });

    if (visitById) {
        if (visitById.dataValues.vet_id === vetID) {
            const { visit_state, description } = req.body;

            visitById.visit_state = visit_state;
            visitById.description = description;

            const response = await visitById.save();

            return res.status(200).send(response);
        } else {
            return res.status(403).send('Forbidden');
        }
    } else {
        return res.status(404).send('No visit was found under given ID');
    }
};

module.exports.deleteVisit = async function(req, res) {
    const vetID = res.locals.user.vet.vet_id;

    const visitById = await req.sequelizers.vets.models.vet_visits.findOne({
        where: { visit_id: req.params.id },
    });

    if (visitById) {
        if (visitById.dataValues.vet_id === vetID) {
            const response = await visitById.destroy();
            return res.status(200).send(response);
        } else {
            return res.status(403).send('Forbidden');
        }
    } else {
        return res.status(404).send('No visit was found under given ID');
    }
};

module.exports.getAllVisitsByVetID = async function(req, res) {
    const vetID = res.locals.user.vet.vet_id;

    const visitsById = await req.sequelizers.vets.models.vet_visits.findAll({
        where: { vet_id: vetID },
        raw: true,
    });

    res.status(200).json(visitsById);
};

module.exports.getAnimalsHealth = async function(req, res) {
    const vetID = res.locals.user.vet.vet_id;

    const treatedAnimals = await req.sequelizers.vets.models.vet_visits.findAll(
        {
            where: {
                vet_id: vetID,
                visit_state: ['in_progress', 'finished'],
            },
            attributes: ['animal_id'],
            raw: true,
        }
    );

    if (treatedAnimals.some(val => val.animal_id == req.params.id)) {
        const animalProfile = await req.sequelizers.vets.models.animal_health.findOne(
            {
                where: {
                    animal_id: req.params.id,
                },
                raw: true,
            }
        );

        res.status(200).json(animalProfile);
    } else {
        res.status(403).send(
            "This vet has never treated this animal or the visit is in state :'in_progress'."
        );
    }
};

module.exports.updateAnimalsHealth = async function(req, res) {
    const vetID = res.locals.user.vet.vet_id;

    const treatedAnimals = await req.sequelizers.vets.models.vet_visits.findAll(
        {
            where: {
                vet_id: vetID,
                visit_state: ['in_progress', 'finished'],
            },
            attributes: ['animal_id'],
            raw: true,
        }
    );

    if (treatedAnimals.some(val => val.animal_id == req.params.id)) {
        const animalProfile = await req.sequelizers.vets.models.animal_health.findOne(
            {
                where: {
                    animal_id: req.params.id,
                },
            }
        );

        if (animalProfile) {
            if (req.body.health_condition) {
                animalProfile.health_condition = req.body.health_condition;
                try {
                    const response = await animalProfile.save();

                    res.status(200).send(response);
                } catch (error) {
                    console.log('[ERROR]:', error.message);
                    res.status(400).send(error.message);
                }
            } else {
                res.status(400).send('Incomplete data');
            }
        } else {
            res.status(404).status('Animal does not exist in database.');
        }
    } else {
        res.status(403).send(
            "This vet has never treated this animal or the visit is in state :'in_progress'."
        );
    }
};

module.exports.createAnimalProfile = async function(req, res) {
    const caretakerID = res.locals.user.caretaker.caretaker_id;

    const { species, name, birth_date, health, place_id } = req.body;
    if (
        !(
            species &&
            name &&
            health &&
            place_id &&
            birth_date &&
            birth_date.year &&
            birth_date.month &&
            birth_date.day
        )
    ) {
        return res.status(400).send('Incomplete data');
    }

    const birthDateFormatted = new Date(
        birth_date.year,
        birth_date.month,
        birth_date.day
    );
    const animalInfo = req.body;
    animalInfo.caretaker_id = caretakerID;

    delete animalInfo.birth_date;
    animalInfo.birth_date = birthDateFormatted.toISOString();

    try {
        const createdProfile = await req.sequelizers.caretakers.models.animals.create(
            animalInfo,
            { raw: true }
        );
        res.status(200).json(createdProfile);
    } catch (error) {
        console.log('[ERROR at createAnimalProfile]:', error.message);
        res.status(500).send(error.message);
    }
};

module.exports.getAnimalsAssignedToCaretaker = async function(req, res) {
    const CARETAKER_ID = res.locals.user.caretaker.caretaker_id;

    try {
        const animals = await req.sequelizers.caretakers.models.animals.findAll(
            {
                where: { caretaker_id: CARETAKER_ID },
                raw: true,
            }
        );

        res.status(200).json(animals);
    } catch (error) {
        console.log('[ERROR]:', error.message);
        res.status(500).json(error.message);
    }
};

module.exports.updateAnimalProfile = async function(req, res) {
    const ANIMAL_ID = req.params.id;
    const userProfile = res.locals.user;
    const {
        species,
        name,
        birth_date,
        health,
        age,
        place_id,
        caretaker_id,
        address_id,
    } = req.body;

    const newProfileInfo = {
        species,
        name,
        birth_date,
        health,
        age,
        place_id,
        caretaker_id,
        address_id,
    };
    try {
        const animalProfile = await req.sequelizers.caretakers.models.animals.findOne(
            {
                where: {
                    caretaker_id: userProfile.caretaker.caretaker_id,
                    animal_id: ANIMAL_ID,
                },
                raw: false,
            }
        );

        if (animalProfile) {
            for (let key in animalProfile.dataValues) {
                if (key != 'animal_id' && key != 'health') {
                    animalProfile[key] =
                        newProfileInfo[key] || animalProfile[key];
                }
            }
            animalProfile.address_id = 76475;
            const response = await animalProfile.update();

            res.status(200).json(response);
        } else {
            res.status(404).send('Caretaker does not have this animal');
        }
    } catch (error) {
        console.log('[ERROR]:', error.message);
        res.status(500).send(error.message);
    }
};

module.exports.deleteAnimalProfile = async function(req, res) {
    req.sequelizers.admins.transaction({ autocommit: false }).then(async t => {
        const ANIMAL_ID = req.params.id;
        const userProfile = res.locals.user;
        const animalProfile = await req.sequelizers.caretakers.models.animals.findOne(
            { where: { animal_id: ANIMAL_ID }, raw: false }
        );
        const address_id = animalProfile.dataValues.address_id;

        let sum = 0;

        if (address_id) {
            const [
                { count: countWr },
            ] = await req.sequelizers.caretakers.models.workers.count({
                where: { address_id },
                group: ['address_id'],
                raw: true,
            });

            const [
                { count: countAn },
            ] = await req.sequelizers.caretakers.models.animals.count({
                where: { address_id },
                group: ['address_id'],
                raw: true,
            });
            sum = countWr + countAn;
        }

        try {
            if (sum === 1) {
                const response = await req.sequelizers.admins.models.addresses.destroy(
                    {
                        where: {
                            address_id:
                                userProfileToDelete.dataValues.address_id,
                        },
                        transaction: t,
                    }
                );
            }

            const deltedVisits = await req.sequelizers.admins.models.vet_visits.destroy(
                {
                    where: {
                        animal_id: animalProfile.dataValues.animal_id,
                    },
                    transaction: t,
                }
            );
            const profileDeleted = await animalProfile.destroy({
                transaction: t,
            });
            t.commit();
            res.status(200).json({ deltedVisits, profileDeleted });
        } catch (error) {
            console.log('[ERROR]:', error.message);
            t.rollback();
            res.status(500).send(error.message);
        }
    });
};

//  ******************
//     ANIMAL PLACES
//  ******************
module.exports.getAllAnimalPlaces = async function(req, res) {
    const animalPlaces = await req.sequelizers.caretakers.models.animal_places.findAll(
        { raw: true }
    );
    res.status(200).json(animalPlaces);
};

module.exports.createAnimalPlace = async function(req, res) {
    const { place_condition, capacity, name } = req.body;
    const animalPlaceInfo = { place_condition, capacity, name };

    if (
        !(
            animalPlaceInfo.place_condition &&
            animalPlaceInfo.capacity &&
            animalPlaceInfo.name
        )
    ) {
        return res.status(400).send('Incomplete data');
    }

    try {
        const createdAnimalPlaceProfile = await req.sequelizers.caretakers.models.animal_places.create(
            animalPlaceInfo
        );
        return res.status(200).json(createdAnimalPlaceProfile);
    } catch (error) {
        console.log('[ERROR]:', error.message);
        return res.status(500).send(error.message);
    }
};

module.exports.updateAnimalPlace = async function(req, res) {
    const ANIMAL_PLACE_ID = req.params.id;

    const { place_condition, capacity, name } = req.body;
    const animalPlaceInfo = { place_condition, capacity, name };

    if (
        !(
            animalPlaceInfo.place_condition ||
            animalPlaceInfo.capacity ||
            animalPlaceInfo.name
        )
    ) {
        return res.status(400).send('No data was given');
    }

    const animalPlaceProfile = await req.sequelizers.caretakers.models.animal_places.findOne(
        { where: { place_id: ANIMAL_PLACE_ID }, raw: false }
    );

    if (animalPlaceProfile) {
        for (let key in animalPlaceProfile.dataValues) {
            animalPlaceProfile[key] =
                animalPlaceInfo[key] || animalPlaceProfile[key];
        }

        const response = await animalPlaceProfile.save();
        res.status(200).send(response);
    } else {
        res.status(404).send("Didn't found place under given id");
    }
};

module.exports.deleteAnimalPlace = async function(req, res) {
    const ANIMAL_PLACE_ID = req.params.id;

    try {
        const response = await req.sequelizers.caretakers.models.animal_places.destroy(
            { where: { place_id: ANIMAL_PLACE_ID } }
        );

        if (response === 0) {
            return res
                .status(404)
                .send('Nie znaleziono takiego obiektu w bazie.');
        }

        res.status(200).json(response);
    } catch (error) {
        console.log('[ERROR]:', error.message);
        return res.status(500).send(error.message);
    }
};
