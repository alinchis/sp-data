'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Sources', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      source_id: {
        allowNull: false,
        type: Sequelize.STRING(20),
        comment: 'manually selected, unique, string: [name_short.url_country]'
      },
      name_short: {
        allowNull: true,
        type: Sequelize.STRING(30),
        comment: 'short name of the institution /acronym'
      },
      name_long: {
        allowNull: false,
        type: Sequelize.STRING(100),
        comment: 'full name of the institution'
      },
      lang_code: {
        allowNull: false,
        type: Sequelize.CHAR(3),
        comment: '2 letter language code, corresponding to ISO_693-3 column Part1, equivalent 639-1'
      },
      lang_default: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        comment: 'flag to identify default language'
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING,
        comment: 'a few words abount the institution'
      },
      url: {
        allowNull: true,
        type: Sequelize.STRING,
        comment: 'internet homepage address, if available'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },
    {
      schema: 'aa_metadata',
      comment: 'Data providers list'
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Sources');
  }
};