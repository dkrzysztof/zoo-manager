/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    let animalPlaces = sequelize.define(
        'animal_places',
        {
            place_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            capacity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: '15',
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            place_condition: {
                type: DataTypes.ENUM(
                    'very_poor',
                    'poor',
                    'fair',
                    'good',
                    'very_good'
                ),
                allowNull: false,
            },
        },
        {
            tableName: 'animal_places',
        }
    );

    animalPlaces.associate = model => {
        model.animals
            ? animalPlaces.hasMany(model.animals, { foreignKey: 'animal_id' })
            : false;
    };

    return animalPlaces;
};
