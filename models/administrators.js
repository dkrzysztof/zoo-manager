/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    let administrators = sequelize.define(
        'administrators',
        {
            admin_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            type: {
                type: DataTypes.ENUM('dyrektor', 'pracownik', 'leader'),
                allowNull: false
            },
            worker_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            tableName: 'administrators'
        }
    );

    administrators.associate = (models) => {
        administrators.belongsTo(models.workers, { foreignKey: 'worker_id' });
    };

    return administrators;
};
