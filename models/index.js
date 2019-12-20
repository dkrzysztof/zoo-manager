async function loadModels(sequelize) {
    const Addresses = sequelize.import(__dirname + '\\addresses');
    const Administrators = sequelize.import(__dirname + '\\administrators');
    const AnimalPlaces = sequelize.import(__dirname + '\\animal_places');
    const Animals = sequelize.import(__dirname + '\\animals');
    const Caretakers = sequelize.import(__dirname + '\\caretakers');
    const vetVisits = sequelize.import(__dirname + '\\vet_visits');
    const Vets = sequelize.import(__dirname + '\\vets');
    const Workers = sequelize.import(__dirname + '\\workers');

    try {
        Addresses.sync();
        Administrators.sync();
        AnimalPlaces.sync();
        Animals.sync();
        Caretakers.sync();
        vetVisits.sync();
        Vets.sync();
        Workers.sync();
    } catch (error) {
        console.log('ERROR', error.message);
    }

    sequelize.models = {
        Addresses,
        Administrators,
        AnimalPlaces,
        Animals,
        Caretakers,
        vetVisits,
        Vets,
        Workers
    };
}

module.exports = loadModels;
