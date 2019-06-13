'use strict';


module.exports = (sequelize, DataTypes) => {
  const Source = sequelize.define('Source', {
    source_id: {
      allowNull: false,
      type: DataTypes.STRING(20),
      comment: 'manually selected, unique, string: [name_short.url_country]'
    },
    name_short: {
      allowNull: true,
      type: DataTypes.STRING(30),
      comment: 'short name of the institution /acronym'
    },
    name_long: {
      allowNull: false,
      type: DataTypes.STRING(100),
      comment: 'full name of the institution'
    },
    lang_code: {
      allowNull: false,
      type: DataTypes.CHAR(3),
      comment: '2 letter language code, corresponding to ISO_693-3 column Part1, equivalent 639-1'
    },
    lang_default: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      comment: 'flag to identify default language'
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING,
      comment: 'a few words abount the institution'
    },
    url: {
      allowNull: true,
      type: DataTypes.STRING,
      comment: 'internet homepage address, if available'
    },
  }, {
    schema: 'aa_metadata',
    comment: 'Data providers list'
  });
  Source.associate = function(models) {
    // associations can be defined here
  };

  return Source;
};