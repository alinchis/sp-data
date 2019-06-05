// routes/db.js


const express = require('express');
const router = express.Router();


const db = require('../dbinit/index');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now());
  next();
});
// define the home page route
router.get('/', (req, res) => {
  res.send('DataBase home page');
});
// define the about route
router.get('/init', db);


module.exports = router;
