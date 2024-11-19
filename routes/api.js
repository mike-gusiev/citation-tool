const express = require('express');


const usersRouter = require('./users');
const searchRouter = require('./search');
const pingRouter = require('./ping');
const downloadRouter = require('./download');

const router = express.Router();

router.use('/users', usersRouter);
router.use('/search', searchRouter);
router.use('/ping', pingRouter);
router.use('/files', downloadRouter);

module.exports = router;