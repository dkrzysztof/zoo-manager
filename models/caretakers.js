/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('caretakers', {
    caretaker_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    shift: {
      type: DataTypes.ENUM("morning","evening","night"),
      allowNull: false
    },
    worker_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'caretakers'
  });
};
