/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    let caretakers = sequelize.define(
        'caretakers',
        {
            caretaker_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            shift: {
                type: DataTypes.ENUM('morning', 'evening', 'night'),
                allowNull: false
            },
            worker_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            }
        },
        {
            tableName: 'caretakers'
        }
    );

    caretakers.associate = (models) => {
        caretakers.belongsTo(models.workers, { foreignKey: 'worker_id' });
        caretakers.hasMany(models.animals, { foreignKey: 'animal_id' });
    };

    return caretakers;
};
