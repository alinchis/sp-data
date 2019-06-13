'use strict';
module.exports = (sequelize, DataTypes) => {
  const ISO_639_Name = sequelize.define('ISO_639-3_Name', {
    Id: {
      allowNull: false,
      type: DataTypes.CHAR(3),
      comment: 'The three-letter 639-3 identifier',
    },
    Print_Name: {
      allowNull: false,
      type: DataTypes.STRING(75),
      comment: 'One of the names associated with this identifier',
    },
    Inverted_Name: {
      allowNull: false,
      type: DataTypes.STRING(75),
      comment: 'The inverted form of this Print_Name form',
    },
  }, {
    schema: 'bb_nomenclature',
    comment: 'The ISO 639-3 code tables now include a language name index with multiple names associated many code elements (primarily in English forms or variant anglicized spellings of indigenous names).'
  });
  ISO_639_Name.associate = function(models) {
    // associations can be defined here
  };
  return ISO_639_Name;
};
