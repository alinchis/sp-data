'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ISO_639-3_Macrolanguages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      M_Id: {
        allowNull: false,
        type: Sequelize.CHAR(3),
        comment: 'The identifier for a macrolanguage',
      },
      I_Id: {
        allowNull: false,
        type: Sequelize.CHAR(3),
        comment: 'The identifier for an individual language that is a member of the macrolanguage',
      },
      I_Status: {
        allowNull: false,
        type: Sequelize.CHAR(1),
        comment: 'A (active) or R (retired) indicating the status of the individual code element',
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
      comment: 'The complete set of mappings from macrolanguages to the individual languages.'
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ISO_639-3_Macrolanguages');
  }
};
