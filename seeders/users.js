'use strict';
const sequelize_fixtures = require('sequelize-fixtures');
const model = require('../api/models/users');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return sequelize_fixtures.loadFile('test/fixtures/users.json', model);


    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
