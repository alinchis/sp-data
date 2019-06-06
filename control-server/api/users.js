const express = require('express');

const router = express.Router();

const queries = require('../db/queries');

// /////////////////////////////////////////////////////////////////////////////////////
// middleware

// check if id is valid
function isValidId(req, res, next) {
  if(!isNaN(req.params.id)) return next();
  next(new Error('Invalid ID'));
}

function isValidUser(user) {
  const hasName = typeof user.name == 'string' && user.name.trim() != '';
  const hasUsername = typeof user.username == 'string' && user.username.trim() != '';
  return hasName && hasUsername;
}

router.get('/', (req, res) => {
  queries.getAll().then((users) => {
    res.json(users);
  });
});

router.get('/:id', isValidId, (req, res, next) => {
  queries.getOne(req.params.id).then((user) => {
    if (user) {
      res.json(user);
    } else {
      // res.status(404);
      next();
    }
    
  });
});

router.post('/', (req, res, next) => {
  if(isValidUser(req.body)) {
    queries.create(req.body).then((users) => {
      res.json(users[0]);
    })
  } else {
    next(new Error('Invalid user'));
  };
});

module.exports = router;