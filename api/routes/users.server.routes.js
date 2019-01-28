const express = require('express');
const users = require('../controllers/users.server.controller');

const router = express.Router();
router.get('/me', users.me);
router.put('/:id/password', users.changePassword);

module.exports = router;