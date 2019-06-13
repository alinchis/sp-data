
const Source = require('../models').Source;

// path to seed file
const sourcesFolder = '../../docker-data/control/seeds/aa_metadata/Sources`';
const sourcesFilePath = `${sourcesFolder}/sources.json`;

// ////////////////////////////////////////////////////////////////////////////
// METHODS

// create new rows
function localAddRows(items) {
  return Source
    .bulkCreate(items, { validate: true })
    .then(() => Source.findAll({
      attributes: [[Source.sequelize.fn('COUNT', Source.sequelize.col('*')), 'total']],
    }))
    .catch(err => err);
};

// find rows on key
function localFindRowsOnKey(options) {
  return Source
    .findAll({
      where: options,
      raw: true,
    })
    .catch(err => console.log(err));
};

// 


module.exports = {


  // ////////////////////////////////////////////////////////////////////////////
  // REQUESTS

  // CREATE /////////////////////////////////////////
  // seed table
  seedTable(req, res) {
    const rowArr = require(sourcesFilePath).sources;
    console.log(rowArr);
    localAddRows(rowArr)
      .then(count => res.status(200).send(count))
      .catch(err => err);
  },

  // create new row
  addRow(req, res) {
    return Source
      .create({
        source_id: req.body.source_id,
        name_short: req.body.name_short,
        name_long: req.body.name_long,
        lang_code: req.body.lang_code,
        lang_default: req.body.lang_default,
        description: req.body.description,
        url: req.body.url,
      })
      .then(row => res.status(201).send(row))
      .catch(error => res.status(400).send(error));
  },

  // create new rows
  addRows(req, res) {

  },

  // READ /////////////////////////////////////////
  // get rows for provided key:value pair
  findRowsOnKey(req, res) {
    const options = {};
    options[req.body.key] = req.body.value;

    return Source
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
    return Source
      .findAll({
        hierarchy: true,
      })
      .then(rows => res.status(200).send({
        success: true,
        message: `Retrieved ${rows.length} rows`,
        rows,
      }))
      .catch(err => res.status(404).send({
        success: false,
        message: err,
      }));
  },

  // UPDATE /////////////////////////////////////////
  // update one row for provided key:value pair
  updateRowOnKey(req, res) {
    const options = {};
    options[req.body.key] = req.body.value;

    return Source
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
      .then(row => res.status(201).send(row))
      .catch(error => res.status(400).send(error));
  },

  // DELETE /////////////////////////////////////////
  // delete one row on id
  deleteRowOnId(req, res) {
    return Source
      .destroy({
        where: { id: req.body.id },
      })
      .then(row => res.status(201).send(row))
      .catch(error => res.status(400).send(error));
  },

  // delete all items from table
  clearTable(req, res) {
    const schema = 'aa_metadata';
    const table = 'Sources';

    return Source.sequelize.query(`TRUNCATE TABLE "${schema}"."${table}" RESTART IDENTITY`)
      .spread((results, metadata) => {
      // Results will be an empty array and metadata will contain the number of affected rows.
        res.status(200)
          .json({
            status: metadata,
            data: results,
            message: `Table "${schema}"."${table}" cleared`,
          });
      });
  },
};
