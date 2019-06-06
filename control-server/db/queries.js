const knex = require('./knex'); // requires the connection

module.exports = {
  getAll() {
    return knex('users'); // .select('*') is implicit
  },
  getOne(id) {
    return knex('users').where('id', id).first();
  },
  create(user) {
    return knex('users').insert(user, '*');
  }
}