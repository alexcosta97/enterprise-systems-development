const express = require('express');
const passport = require('@passport-next/passport');
const users = require('../controllers/user.controller');

const router = express.Router();
router.get('/:id', users.getUser);
router.put('/', passport.authenticate('jwt', {session: false}), users.update);
router.delete('/', passport.authenticate('jwt', {session: false}), users.delete);

module.exports = router;