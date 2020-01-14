async function loadModels(sequelize, sequelizeName) {
    let MODEL_LIST;
    switch (sequelizeName) {
        case 'admins':
            MODEL_LIST = [
                'addresses',
                'administrators',
                'animal_places',
                'animals',
                'caretakers',
                'vet_visits',
                'vets',
                'workers'
            ];
            break;
        case 'caretakers':
            MODEL_LIST = [
                'addresses',
                'animal_places',
                'animals',
                'caretakers',
                'workers'
            ];
            break;
        case 'vets':
            MODEL_LIST = ['addresses', 'vet_visits', 'vets', 'workers','animal_health'];
            break;
        case 'guests':
            MODEL_LIST = ['animal_places', 'animals'];
            break;
        default:
            MODEL_LIST = [];
            break;
    }

    MODEL_LIST.map((x) => {
        let modelX = sequelize.import(__dirname + '\\' + x);
        // modelX.options.timestamps = false;
        
        sequelize.models ? null : (sequelize.models = {});
        sequelize.models[x] = modelX;
    });

    for (let obj in sequelize.models) {
        sequelize.models[obj].associate(sequelize.models);
    }

    for (let obj in sequelize.models) {
        try {
            sequelize.models[obj].sync();
        } catch (error) {
            console.log("ERROR in 'loadModels : sync()' :", error.message);
        }
    }
}

module.exports = loadModels;
