'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // LABEL
      user.hasMany(models.label, {
        foreignKey: 'user_id',
        as: 'labels',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // ARTIST
      user.hasMany(models.artist, {
        foreignKey: 'user_id',
        as: 'artists',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  user.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      unique: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM,
      values: ['admin', 'user'],
      allowNull: false,
      defaultValue: 'user'
    }
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};