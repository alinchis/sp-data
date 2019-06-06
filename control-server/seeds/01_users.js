// import data from .json file
const usersList = require('./mock_users-list.json');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert(usersList);
    });
};
