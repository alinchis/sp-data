
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
  // bulk add rows

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
  app.post('/api/sources/clearRows', controller.sources.clearRows);
  
};