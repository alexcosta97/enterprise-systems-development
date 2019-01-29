const express = require('express');
const passport = require('passport');
const rooms = require('../controllers/rooms.controller');

const router = express.Router();
router.get('/', rooms.getAll);
router.get('/:id', rooms.getRoom);
router.post('/', passport.authenticate('jwt', {session: false}), rooms.createRoom);
router.put('/:id', passport.authenticate('jwt', {session: false}), rooms.updateRoom);
router.delete('/:id', passport.authenticate('jwt', {session: false}), rooms.deleteRoom);

module.exports = router;