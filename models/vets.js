/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define(
        'vets',
        {
            vet_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
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
};
