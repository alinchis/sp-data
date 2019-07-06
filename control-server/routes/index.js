
const controller = require('../controllers');

module.exports = (app) => {
  // blank request
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Sources API!',
  }));

  // //////////////////////////////////////////////////////////////////////////
  // Sources Table

  // CREATE
  // add one row
  app.post('/api/sources/addRow', controller.sources.addRow);

  // READ
  // find all rows on key:value pair
  app.get('/api/sources/findRowsOnKey', controller.sources.findRowsOnKey);
  // get all rows
  app.get('/api/sources/listRows', controller.sources.listRows);

  // UPDATE

  // DELETE
  // delete row on id
  app.post('/api/sources/deleteRowOnId', controller.sources.deleteRowOnId);
  // clear all rows
  app.post('/api/sources/clearTable', controller.sources.clearTable);
  

  // //////////////////////////////////////////////////////////////////////////
  // ISO_639-3_Codes Table

  // CREATE
  // add one row
  // app.post('/api/iso_639_3/addRow', controller.iso_639_3.addRow);
  // seed table
  app.post('/api/iso_639_3/seedTables', controller.iso_639_3.seedTables);

  // READ
  // find all rows on key:value pair
  // app.get('/api/iso_639_3/findRowsOnKey', controller.iso_639_3.findRowsOnKey);
  // get all rows
  // app.get('/api/iso_639_3/listRows', controller.iso_639_3.listRows);

  // UPDATE

  // DELETE
  // delete row on id
  // app.post('/api/iso_639_3/deleteRowOnId', controller.iso_639_3.deleteRowOnId);
  // clear all rows
  app.post('/api/iso_639_3/clearTables', controller.iso_639_3.clearTables);
};