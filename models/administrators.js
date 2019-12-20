/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('administrators', {
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM("dyrektor","pracownik","leader"),
      allowNull: false
    },
    worker_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'administrators'
  });
};
