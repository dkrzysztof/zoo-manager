/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    let animalPlaces = sequelize.define(
        'animal_places',
        {
            place_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            animal_count: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: '0'
            },
            place_condition: {
                type: DataTypes.ENUM(
                    'very_poor',
                    'poor',
                    'fair',
                    'good',
                    'very_good'
                ),
                allowNull: false
            }
        },
        {
            tableName: 'animal_places'
        }
    );

    animalPlaces.associate = (model) => {
        model.animals
            ? animalPlaces.hasMany(model.animals, { foreignKey: 'animal_id' })
            : false;
    };

    return animalPlaces;
};
