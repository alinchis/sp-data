const schema = 'bb_nomenclature';
const table = 'ISO_639-3_Macrolanguages';

const fs = require('fs-extra');
const Model = require('../models')['ISO_639-3_Macrolanguage'];
// const Op = require('../models').Sequelize.Op;

// paths
const seedPath = '../control-data/seeds/bb_nomenclature/SIL-ISO_639';
const seedFileName = 'iso-639-3_Macrolanguages_20190408.tab';

// ////////////////////////////////////////////////////////////////////////////
// METHODS

// READ Data from CSV file
function readCSV(filePath, delimiter) {
  // if file is found in path
  if (fs.existsSync(filePath)) {
    // return array of objects
    const newArray = fs.readFileSync(filePath, 'utf8').split('\n').splice(1);
    return newArray.filter(line => line).map(line => {
      const record = line.split(delimiter || ',');
      // return new object for each line
      return {
        M_Id: record[0].trim(),
        I_Id: record[1].trim(),
        I_Status: record[2].trim(),
      };
    });
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


// CREATE /////////////////////////////////////////
// create new row
function dbAddRow(item) {
  return Model
    .findOrCreate({
      where: {
        Id: item.Id,
      },
      defaults: {
        M_Id: item.M_Id,
        I_Id: item.I_Id,
        I_Status: item.I_Status,
      },
    })
    .then((row) => row)
    .catch(err => err);
};

// Add a bulk of rows at once
async function dbAddRows(items) {
  return Model
    .bulkCreate(items, {
      validate: true
    })
    .then(() => Model.findAll({
      attributes: [
        [Model.sequelize.fn('COUNT', Model.sequelize.col('*')), 'total']
      ],
    }))
    .catch(err => err);
}


// READ /////////////////////////////////////////
// get all rows from table
function dbGetAllRows() {
  return Model
    .findAll({
      hierarchy: true,
    })
    .then(rows => {
      return {
        success: true,
        message: `Retrieved ${rows.length} rows`,
        rows,
      }
    })
    .catch(err => {
      return {
        success: false,
        message: err,
      }
    });
};

// find rows on key
function dbFindRowsOnKey(options) {
  return Model
    .findAll({
      where: options,
      raw: true,
    })
    .catch(err => console.log(err));
};

// DELETE /////////////////////////////////////////
// delete one row on id
function dbDeleteRowOnId(options) {
  return Model
    .destroy({
      where: {
        id: options.id
      },
    })
    .then(countRows => {
      return {
        status: 200,
        countRows
      }
    })
    .catch(error => error);
};

// delete all items from table
async function dbClearTable() {
  return Model.sequelize.query(`TRUNCATE TABLE "${schema}"."${table}" RESTART IDENTITY`)
    .spread((results, metadata) => {
      // Results will be an empty array and metadata will contain the number of affected rows.
      return {
        status: metadata,
        data: results,
        message: `Table "${schema}"."${table}" cleared`,
      };
    });
};


// EXPORT
module.exports = {


  // ////////////////////////////////////////////////////////////////////////////
  // REQUESTS

  // CREATE /////////////////////////////////////////
  // seed table
  async seedTable() {
    console.log('\n>>>>>>>>>>>>>>>>>>>>>>>>>\n');
    const itemsCount = await Model.count()
      .then(c => c)
      .catch(err => err);
    console.log(itemsCount);
    // if items counts === 0, the table is not already seeded
    if (itemsCount === 0) {
      // add rows
      const rowArr = readCSV(`${seedPath}/${seedFileName}`, '\t');
      console.log(rowArr.length);
      const data = await dbAddRows(rowArr)
        .then(count => count)
        .catch(err => err);

      // return data to client
      return data;

      // else, the table has been seeded already
    } else {
      // send no of items in table
      return {
        total: `${itemsCount}`
      };
    }
  },


  // Add a bulk of rows at once
  async seedRows(items) {
    return Model
      .bulkCreate(items, {
        validate: true
      })
      .then(() => Model.findAll({
        attributes: [
          [Model.sequelize.fn('COUNT', Model.sequelize.col('*')), 'total']
        ],
      }))
      .catch(err => err);
  },

  // delete all items from table
  async dbClearTable() {
    return Model.sequelize.query(`TRUNCATE TABLE "${schema}"."${table}" RESTART IDENTITY`)
      .spread((results, metadata) => {
        // Results will be an empty array and metadata will contain the number of affected rows.
        return {
          status: metadata,
          data: results,
          message: `Table "${schema}"."${table}" cleared`,
        };
      });
  },

  // create new row
  addRow(req, res) {
    return dbAddRow(req.body)
      .then(row => res.send({
        status: 201,
        row
      }))
      .catch(error => res.status(400).send(error));
  },


  // READ /////////////////////////////////////////
  // count items in table
  async count() {
    return Model.count()
      .then(c => c)
      .catch(err => err);
  },

  // get rows for provided key:value pair
  findRowsOnKey(req, res) {
    const options = {};
    options[req.body.key] = req.body.value;

    return Model
      .findAll({
        where: options
      }).then(rows => res.status(200).send({
        success: true,
        message: `Retrieved ${rows.length} rows`,
        rows,
      }))
      .catch(err => res.status(404).send({
        success: false,
        message: err,
      }));
  },

  // get all rows from table
  listRows(req, res) {
    return dbGetAllRows()
      .then(rows => res.send(rows))
      .catch(error => res.sendStatus(400).send(error));
  },

  // UPDATE /////////////////////////////////////////
  // update one row for provided key:value pair
  updateRowOnKey(req, res) {
    // const options = {};
    // options[req.body.key] = req.body.value;

    // return Model
    //   .update({
    //     source_id: req.body.source_id,
    //     name_short: req.body.name_short,
    //     name_long: req.body.name_long,
    //     lang_code: req.body.lang_code,
    //     lang_default: req.body.lang_default,
    //     description: req.body.description,
    //     url: req.body.url,
    //   },
    //   { where: { source_id: req.body.source_id }, })
    // .then(row => res.send(row))
    // .catch(error => res.sendStatus(400).send(error));
  },

  // DELETE /////////////////////////////////////////
  // delete one row on id
  deleteRowOnId(req, res, stat) {
    console.log(req.body);
    return dbDeleteRowOnId(req.body)
      .then(row => res.send(row))
      .catch(error => res.sendStatus(400).send(error));
  },

  // delete all items from table
  clearTable(req, res) {
    return dbClearTable()
      .then(mess => res.send(mess))
      .catch(error => res.sendStatus(400).send(error));
  },
};