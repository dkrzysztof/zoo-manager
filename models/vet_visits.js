/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vet_visits', {
    visit_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    vet_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    visit_state: {
      type: DataTypes.ENUM("pending","in progress","finished"),
      allowNull: false
    },
    visit_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    animal_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'vet_visits'
  });
};
