const express = require('express');
const router = express.Router();

/* GET default rout. */
router.get('/', function(req, res, next) {
  res.send('default!');
});

module.exports = router;
