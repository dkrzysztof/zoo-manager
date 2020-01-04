/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    let animals = sequelize.define(
        'animals',
        {
            animal_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            species: {
                type: DataTypes.STRING,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            birth_date: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            health: {
                type: DataTypes.ENUM(
                    'worst',
                    'bad',
                    'unhealthy',
                    'promising',
                    'healthy'
                ),
                allowNull: false
            },
            age: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            place_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                primaryKey: true
            },
            caretaker_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                primaryKey: true
            },
            address_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                primaryKey: true
            }
        },
        {
            tableName: 'animals'
        }
    );

    animals.associate = (models) => {
        models.addresses
            ? animals.belongsTo(models.addresses, { foreignKey: 'address_id' })
            : false;
        models.caretakers
            ? animals.belongsTo(models.caretakers, {
                  foreignKey: 'caretaker_id'
              })
            : false;
        //animals.hasMany(models.vetVisits, { foreignKey: 'animal_id' });
    };

    return animals;
};
