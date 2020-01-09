/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    let vets = sequelize.define(
        'vets',
        {
            vet_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            vet_specialty: {
                type: DataTypes.ENUM(
                    'Exotic_animal_veterinarian',
                    'Equine_medicine',
                    'Aquatic_medicine',
                    'Conservation_medicine',
                    'Birds_medicine',
                    'Cardiology',
                    'Nutrition',
                    'Feline_medicine',
                    'Canine_medicine',
                    'Fish_medicine',
                    'Reptile_and_amphibian_medicine'
                ),
                allowNull: false
            },
            worker_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            }
        },
        {
            tableName: 'vets'
        }
    );
    vets.associate = (models) => {
        vets.belongsTo(models.workers, { foreignKey: 'worker_id' });
        vets.hasMany(models.vet_visits, { foreignKey: 'vet_id' });
    };

    return vets;
};
