'use strict';
const {
    Model,
    Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Blog extends Model {
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

            this.hasMany(models.Comments, {
                sourceKey: "postId",
                foreignKey: "PostId"
            })
        }
    }
    Blog.init({
        postId: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        UserId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
                model: 'Users',
                key: 'userId'
            },
            onDelete: "CASCADE"
        },
        title: {
            allowNull: false,
            type: Sequelize.STRING
        },
        content: {
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
        modelName: 'Blogs',
    });
    return Blog;
};