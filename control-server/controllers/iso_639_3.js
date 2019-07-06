const fs = require('fs-extra');
const Code = require('./iso_639_3_codes.js');
const Macrolanguage = require('./iso_639_3_macrolanguages.js');
const Name = require('./iso_639_3_names.js');
const Retirement = require('./iso_639_3_retirements.js');
const Source = require('./sources.js');
const Op = require('../models').Sequelize.Op;

// paths
const seedPath = '../control-data/seeds/bb_nomenclature/SIL-ISO_639';
const codeFileName = 'iso-639-3_20190408.tab';
const macrolanguageFileName = 'iso-639-3_Macrolanguages_20190408.tab';
const nameFileName = 'iso-639-3_Name_Index_20190408.tab';
const retirementFileName = 'iso-639-3_Retirements_20190408.tab';
const metadataFileName = 'metadata.json';
const sourceFileName = 'source.json';

// ////////////////////////////////////////////////////////////////////////////
// METHODS

// READ Data from CSV file
function readCSV(filePath, delimiter) {
  // if file is found in path
  if (fs.existsSync(filePath)) {
    // return array of objects
    const newArray = fs.readFileSync(filePath, 'utf8').split('\n').splice(1);
    return newArray.filter(line => line).map(line => line.split(delimiter || ','));
  };
  // else return empty array
  console.log('\x1b[31m%s\x1b[0m', `ERROR: \'${filePath}\' file NOT found!`);
  return [];
};

// READ data from JSON file
function readJSON(filePath) {
  // if file is found in path
  if (fs.existsSync(filePath)) {
    // return parsed file
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  };
  // else return empty object
  console.log('\x1b[31m%s\x1b[0m', `ERROR: \'${filePath}\' file NOT found!`);
  return {};
};


// EXPORT
module.exports = {


  // ////////////////////////////////////////////////////////////////////////////
  // REQUESTS

  // CREATE /////////////////////////////////////////
  // seed table
  async seedTables(req, res) {
    console.log('\n SEED ISO-639-3 tables >>>>>>>>>>>>>>>>>>>>>>>>>\n');
    // const returnData = [];

    const modelArr = [{
        Model: Code,
        fileName: codeFileName
      },
      {
        Model: Macrolanguage,
        fileName: macrolanguageFileName
      },
      {
        Model: Name,
        fileName: nameFileName
      },
      {
        Model: Retirement,
        fileName: retirementFileName
      },
    ];

    const returnData = await Promise.all(modelArr.map(async (item) => {
      // check db table items count
      const itemsCount = await item.Model.seedTable();
      console.log(`\nCheck DB table: ${itemsCount} items`);
      // return items count
      return itemsCount;
    }));

    // read source file
    const dataSource = readJSON(`${seedPath}/${sourceFileName}`);
    // add source
    // console.log(dataSource);
    try {
      const sourceItem = await Source.dbAddRow(dataSource);
      console.log(`Source ID = ${sourceItem[0].id}\n`);
    } catch (err) {
      console.log(err);
    }

    // read metadata file

    // add metadata

    // send no of items in tables
    res.send(returnData);
  },

  // READ /////////////////////////////////////////


  // UPDATE /////////////////////////////////////////

  // delete all items from all table
  async clearTables(req, res) {
    console.log('\n>>>>>>>>>>>>>>>>>>>>>>>>>\n');
    const returnData = [];

    const modelArr = [Code, Macrolanguage, Name, Retirement];

    for (model of modelArr) {
      returnData.push(await model.dbClearTable()
        .then(mess => {
          return mess;
        })
        .catch(error => res.sendStatus(400).send(error)));
    }

    res.send(returnData);
  }
};