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

module.exports.createAccountType = async function(sequelizer, accountInfo, user, t) {
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

