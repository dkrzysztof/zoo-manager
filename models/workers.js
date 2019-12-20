/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('workers', {
    worker_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
  }, {
    tableName: 'workers'
  });
};
