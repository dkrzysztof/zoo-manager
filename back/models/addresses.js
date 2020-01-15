/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    let addresses = sequelize.define(
        'addresses',
        {
            address_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            street: {
                type: DataTypes.STRING,
                allowNull: false
            },
            building_number: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            flat_number: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            city: {
                type: DataTypes.STRING,
                allowNull: false
            },
            post_code: {
                type: DataTypes.STRING,
                allowNull: false
            },
            country: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            tableName: 'addresses'
        }
    );

    addresses.associate = (models) => {
        models.workers
            ? addresses.hasMany(models.workers, { foreignKey: 'address_id' })
            : false;
        models.animals
            ? addresses.hasMany(models.animals, { foreignKey: 'address_id' })
            : false;
    };

    return addresses;
};
