'use strict';
const {
    Model,
    Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Commtents extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here

            this.belongsTo(models.Users, {
                targetKey: "userId",
                foreignKey: "UserId"
            })

            this.belongsTo(models.Blogs, {
                targetKey: "postId",
                foreignKey: "PostId"
            })

        }
    }
    Commtents.init({
        commentsId: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        UserId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
                model: "Users",
                key: "userId"
            },
            onDelete: "CASCADE"
        },
        PostId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
                model: "Blogs",
                key: "postId"
            },
            onDelete: "CASCADE"
        },
        comments: {
            allowNull: false,
            type: DataTypes.STRING
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: Sequelize.fn("now")
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: Sequelize.fn("now")
        }
    }, {
        sequelize,
        modelName: 'Comments',
    });
    return Commtents;
};