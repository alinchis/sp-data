'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ISO_639-3_Names', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Id: {
        allowNull: false,
        type: Sequelize.CHAR(3),
        comment: 'The three-letter 639-3 identifier',
      },
      Print_Name: {
        allowNull: false,
        type: Sequelize.STRING(75),
        comment: 'One of the names associated with this identifier',
      },
      Inverted_Name: {
        allowNull: false,
        type: Sequelize.STRING(75),
        comment: 'The inverted form of this Print_Name form',
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
      schema: 'bb_nomenclature',
      comment: 'The ISO 639-3 code tables now include a language name index with multiple names associated many code elements (primarily in English forms or variant anglicized spellings of indigenous names).'
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ISO_639-3_Names');
  }
};
