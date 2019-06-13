'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ISO_639-3_Codes', {
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
      Part2B: {
        allowNull: true,
        type: Sequelize.CHAR(3),
        comment: 'Equivalent 639-2 identifier of the bibliographic applications code set, if there is one',
      },
      Part2T: {
        allowNull: true,
        type: Sequelize.CHAR(3),
        comment: 'Equivalent 639-2 identifier of the terminology applications code set, if there is one',
      },
      Part1: {
        allowNull: true,
        type: Sequelize.CHAR(2),
        comment: 'Equivalent 639-1 identifier, if there is one',
      },
      Scope: {
        allowNull: false,
        type: Sequelize.CHAR(1),
        comment: 'I(ndividual), M(acrolanguage), S(pecial)',
      },
      Type: {
        allowNull: false,
        type: Sequelize.CHAR(1),
        comment: 'A(ncient), C(onstructed), E(xtinct), H(istorical), L(iving), S(pecial)',
      },
      Ref_Name: {
        allowNull: false,
        type: Sequelize.STRING(150),
        comment: 'Reference language name',
      },
      Comment: {
        allowNull: true,
        type: Sequelize.STRING(150),
        comment: 'Comment relating to one or more of the columns',
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
      comment: 'The complete ISO 639-3 code set.'
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ISO_639-3_Codes');
  }
};
