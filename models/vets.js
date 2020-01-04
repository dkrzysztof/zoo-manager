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
                    'Choroby koni',
                    'Choroby psów i kotów',
                    'Choroby drobiu oraz ptaków ozdobnych',
                    'Choroby zwierząt futerkowych',
                    'Choroby ryb',
                    'Choroby owadów użytkowych',
                    'Choroby zwierząt nieudomowionych',
                    'Chirurgia weterynaryjna',
                    'Weterynaryjna diagnostyka laboratoryjna'
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
