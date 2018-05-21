/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Notification', {
      IdNotification: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },IdUser: {
        type: DataTypes.STRING,
        allowNull: false
      } , Date: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Lue: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Evenement: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Montant: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      ClientCorrespondant: {
        type: DataTypes.STRING,
        allowNull: true
      },
      TypeCompteEmetteur: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      TypeCompteRecepteur: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Etat: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    }, {
      createdAt: false,
      updatedAt: false,
      tableName: 'Notification'
    });
  };
  