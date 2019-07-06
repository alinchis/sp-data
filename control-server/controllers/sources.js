const schema = 'aa_metadata';
const table = 'Sources';

const Model = require('../models').Source;
const Op = require('../models').Sequelize.Op;


// ////////////////////////////////////////////////////////////////////////////
// METHODS

// CREATE /////////////////////////////////////////
// create new row
async function dbAddRow(item) {
  return Model
    .findOrCreate({
      where: {
        [Op.or]: [
          {[Op.and]: {source_id: item.source_id, lang_code: item.lang_code}},
          {name_short: {[Op.eq]: item.name_short}},
          {name_long: {[Op.eq]: item.name_long}},
        ]
      },
      defaults: {
        source_id: item.source_id,
        name_short: item.name_short,
        name_long: item.name_long,
        lang_code: item.lang_code,
        lang_default: item.lang_default,
        description: item.description,
        url: item.url,
      },
    })
    .then((row) => row)
    .catch(err => err);
};

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
      where: { id: options.id },
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
function dbClearTable() {
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
  // seedTable(req, res) {
  //   const rowArr = require(sourcesFilePath).sources;
  //   console.log(rowArr);
  //   dbAddRows(rowArr)
  //     .then(count => res.status(200).send(count))
  //     .catch(err => err);
  // },
  dbAddRow,

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
    const options = {};
    options[req.body.key] = req.body.value;

    return Model
      .update({
        source_id: req.body.source_id,
        name_short: req.body.name_short,
        name_long: req.body.name_long,
        lang_code: req.body.lang_code,
        lang_default: req.body.lang_default,
        description: req.body.description,
        url: req.body.url,
      },
      { where: { source_id: req.body.source_id }, })
      .then(row => res.send(row))
      .catch(error => res.sendStatus(400).send(error));
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
