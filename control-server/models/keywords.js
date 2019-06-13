'use strict';
module.exports = (sequelize, DataTypes) => {
  const keywords = sequelize.define('keywords', {
    table_schema: {
      allowNull: false,
      type: DataTypes.STRING(20),
      comment: 'Schema name',
    },
    table_name: {
      allowNull: false,
      type: DataTypes.STRING(50),
      comment: 'Table name, from the database',
    },
    column_label: {
      allowNull: true,
      type: DataTypes.STRING(20),
      comment: 'Column label, as it appears in the database',
    },
    lang_code: {
      allowNull: false,
      type: DataTypes.CHAR(3),
      comment: 'ISO 639-3 language code, Part1',
    },
    keywords: {
      allowNull: false,
      type: DataTypes.JSONB,
      comment: 'Array of keywords',
    },
  }, {
    schema: 'aa_metadata',
    comment: 'Keywords storage for each table and column in table, in JSONB format.',
  });
  keywords.associate = function(models) {
    // associations can be defined here
  };
  return keywords;
};