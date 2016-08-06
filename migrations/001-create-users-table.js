'use strict';

var User = require('./../api/models/users').User;

module.exports = {
    up: function (queryInterface, Sequelize) {
        return User.sync();
    },

    down: function (queryInterface, Sequelize) {
        return User.drop();
    }
};
