'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('keywords', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      table_schema: {
        allowNull: false,
        type: Sequelize.STRING(20),
        comment: 'Schema name',
      },
      table_name: {
        allowNull: false,
        type: Sequelize.STRING(50),
        comment: 'Table name, from the database',
      },
      column_label: {
        allowNull: true,
        type: Sequelize.STRING(20),
        comment: 'Column label, as it appears in the database',
      },
      lang_code: {
        allowNull: false,
        type: Sequelize.CHAR(3),
        comment: 'ISO 639-3 language code, Part1',
      },
      keywords: {
        allowNull: false,
        type: Sequelize.JSONB,
        comment: 'Array of keywords',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, {
      schema: 'aa_metadata',
      comment: 'Keywords storage for each table and column in table, in JSONB format.',
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('keywords');
  }
};