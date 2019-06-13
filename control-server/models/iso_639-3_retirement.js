'use strict';
module.exports = (sequelize, DataTypes) => {
  const ISO_639_Retirement = sequelize.define('ISO_639-3_Retirement', {
    Id: {
      allowNull: false,
      type: DataTypes.CHAR(3),
      comment: 'The three-letter 639-3 identifier',
    },
    Ref_Name: {
      allowNull: false,
      type: DataTypes.STRING(150),
      comment: 'Reference language name',
    },
    Ret_Reason: {
      allowNull: false,
      type: DataTypes.CHAR(1),
      comment: 'Code for retirement: C (change), D (duplicate), N (non-existent), S (split), M (merge)',
    },
    Change_To: {
      allowNull: true,
      type: DataTypes.CHAR(3),
      comment: 'In the cases of C, D, and M, the identifier to which all instances of this Id should be changed',
    },
    Ret_Remedy: {
      allowNull: true,
      type: DataTypes.STRING(300),
      comment: 'The instructions for updating an instance of the retired (split) identifier',
    },
    Effective: {
      allowNull: false,
      type: DataTypes.DATE,
      comment: 'The date the retirement became effective',
    },
  }, {
    schema: 'bb_nomenclature',
    comment: 'The annual update to the 639-3 code set includes a complete listing of the code elements that have been deprecated with instructions on how to update existing data.\nThe table has five columns; the first has the affected identifier, the second has a coded value for the reason the deprecation was necessary, the third contains a single identifier if the deprecated identifier maps unambiguously to another identifier, the fourth contains a prose statement about what should be done to update a code element split, and the fifth gives the date the change was made effective.',
  });
  ISO_639_Retirement.associate = function(models) {
    // associations can be defined here
  };
  return ISO_639_Retirement;
};