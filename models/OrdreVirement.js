/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('OrdreVirement', {
    Num: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Etat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Statut: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    IdUser: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Client',
        key: 'IdUser'
      }
    }
    ,
    titre: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    createdAt: false,
    updatedAt: false,
    tableName: 'OrdreVirement'
  });
};
