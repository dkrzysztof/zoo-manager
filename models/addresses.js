/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('addresses', {
    address_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
  }, {
    tableName: 'addresses'
  });
};
