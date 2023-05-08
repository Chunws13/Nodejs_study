'use strict';
const {
    Model,
    Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.Blogs, {
                sourceKey: "userId",
                foreignKey: "UserId"
            })

            this.hasMany(models.Comments, {
                sourceKey: "userId",
                foreignKey: "UserId"
            })
        }
    }
    User.init({
        userId: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        nickname: {
            allowNull: false,
            unique: true,
            type: Sequelize.STRING
        },
        password: {
            allowNull: false,
            type: Sequelize.STRING
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn("now")
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn("now")
        }
    }, {
        sequelize,
        modelName: 'Users',
    });
    return User;
};