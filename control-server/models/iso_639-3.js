'use strict';
module.exports = (sequelize, DataTypes) => {
  const ISO_639_Code = sequelize.define('ISO_639-3_Code', {
    Id: {
      allowNull: false,
      type: DataTypes.CHAR(3),
      comment: 'The three-letter 639-3 identifier',
    },
    Part2B: {
      allowNull: true,
      type: DataTypes.CHAR(3),
      comment: 'Equivalent 639-2 identifier of the bibliographic applications code set, if there is one',
    },
    Part2T: {
      allowNull: true,
      type: DataTypes.CHAR(3),
      comment: 'Equivalent 639-2 identifier of the terminology applications code set, if there is one',
    },
    Part1: {
      allowNull: true,
      type: DataTypes.CHAR(2),
      comment: 'Equivalent 639-1 identifier, if there is one',
    },
    Scope: {
      allowNull: false,
      type: DataTypes.CHAR(1),
      comment: 'I(ndividual), M(acrolanguage), S(pecial)',
    },
    Type: {
      allowNull: false,
      type: DataTypes.CHAR(1),
      comment: 'A(ncient), C(onstructed), E(xtinct), H(istorical), L(iving), S(pecial)',
    },
    Ref_Name: {
      allowNull: false,
      type: DataTypes.STRING(150),
      comment: 'Reference language name',
    },
    Comment: {
      allowNull: true,
      type: DataTypes.STRING(150),
      comment: 'Comment relating to one or more of the columns',
    },
  }, {
    schema: 'bb_nomenclature',
    comment: 'The complete ISO 639-3 code set.'
  });
  ISO_639_Code.associate = function(models) {
    // associations can be defined here
  };
  return ISO_639_Code;
};
