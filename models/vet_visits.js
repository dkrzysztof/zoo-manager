/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    let vetVisits = sequelize.define(
        'vet_visits',
        {
            visit_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            vet_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false
            },
            visit_state: {
                type: DataTypes.ENUM('pending', 'in_progress', 'finished'),
                allowNull: false
            },
            visit_date: {
                type: DataTypes.DATE,
                allowNull: false
            },
            animal_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            tableName: 'vet_visits'
        }
    );

    vetVisits.associate = (models) => {
        models.animals
            ? vetVisits.belongsTo(models.animals, { foreignKey: 'animal_id' })
            : false;

        models.vets
            ? vetVisits.belongsTo(models.vets, { foreignKey: 'vet_id' })
            : false;
    };

    return vetVisits;
};
