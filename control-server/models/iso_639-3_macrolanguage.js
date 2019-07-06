'use strict';
module.exports = (sequelize, DataTypes) => {
  const ISO_639_Macrolanguage = sequelize.define('ISO_639-3_Macrolanguage', {
    M_Id: {
      allowNull: false,
      type: DataTypes.CHAR(3),
      comment: 'The identifier for a macrolanguage',
    },
    I_Id: {
      allowNull: false,
      type: DataTypes.CHAR(3),
      comment: 'The identifier for an individual language that is a member of the macrolanguage',
    },
    I_Status: {
      allowNull: false,
      type: DataTypes.CHAR(1),
      comment: 'A (active) or R (retired) indicating the status of the individual code element',
    },
  }, {
    schema: 'bb_nomenclature',
    comment: 'The complete set of mappings from macrolanguages to the individual languages.'
  });
  ISO_639_Macrolanguage.associate = function(models) {
    // associations can be defined here
  };
  return ISO_639_Macrolanguage;
};
