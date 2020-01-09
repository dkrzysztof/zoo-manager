/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    let animals = sequelize.define(
        'animal_health',
        {
            animal_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            health_condition: {
                type: DataTypes.ENUM(
                    'very_poor',
                    'poor',
                    'fair',
                    'good',
                    'very_good'
                ),
                allowNull: false
            },
        },
        {
            tableName: 'animal_health'
        }
    );

    animals.associate = (models) => {
        // models.addresses
        //     ? animals.belongsTo(models.addresses, { foreignKey: 'address_id' })
        //     : false;
        // models.caretakers
        //     ? animals.belongsTo(models.caretakers, {
        //           foreignKey: 'caretaker_id'
        //       })
        //     : false;
        //animals.hasMany(models.vetVisits, { foreignKey: 'animal_id' });
    };

    return animals;
};
