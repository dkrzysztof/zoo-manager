module.exports = function(sequelize, DataTypes) {
    let worker = sequelize.define(
        'workers',
        {
            worker_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            firstname: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lastname: {
                type: DataTypes.STRING,
                allowNull: false
            },
            phonenumber: {
                type: DataTypes.STRING,
                allowNull: false
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            worker_password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            address_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                primaryKey: true
            }
        },
        {
            tableName: 'workers'
        }
    );

    worker.associate = (models) => {
        if (models.administrators) {
            worker.hasOne(models.administrators, { foreignKey: 'worker_id' });
        }

        if (models.caretakers) {
            worker.hasOne(models.caretakers, { foreignKey: 'worker_id' });
        }

        if (models.vets) {
            worker.hasOne(models.vets, { foreignKey: 'worker_id' });
        }
        if (models.addresses) {
            worker.belongsTo(models.addresses, { foreignKey: 'address_id' });
        }
    };

    return worker;
};
