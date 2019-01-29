const express = require('express');
const passport = require('passport');
const floors = require('../controllers/floors.controller');

const router = express.Router();
router.get('/', floors.getAll);
router.get('/:id', floors.getFloor);
router.post('/', passport.authenticate('jwt', {session: false}), floors.createFloor);
router.put('/:id', passport.authenticate('jwt', {session: false}), floors.updateFloor);
router.delete('/:id', passport.authenticate('jwt', {session: false}), floors.deleteFloor);

module.exports = router;