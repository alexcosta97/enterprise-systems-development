const express = require('express');
const passport = require('passport');
const floors = require('../controllers/floors.controller');
const multer = require('../config/multer');

const router = express.Router();
router.get('/', floors.getAll);
router.get('/:id', floors.getFloor);
router.post('/', passport.authenticate('jwt', {session: false}), multer.array('picture'), floors.createFloor);
router.put('/:id', passport.authenticate('jwt', {session: false}), multer.array('picture'), floors.updateFloor);
router.delete('/:id', passport.authenticate('jwt', {session: false}), floors.deleteFloor);

module.exports = router;