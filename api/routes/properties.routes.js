const express = require('express');
const passport = require('passport');
const properties = require('../controllers/properties.controller');
const multer = require('../config/multer');

const router = express.Router();
router.get('/', properties.getAll);
router.get('/:id', properties.getProperty);
router.post('/', passport.authenticate('jwt', {session: false}), multer.single('picture'), properties.createProperty);
router.put('/:id', passport.authenticate('jwt', {session: false}), multer.single('picture'), properties.updateProperty);
router.delete('/:id', passport.authenticate('jwt', {session: false}), properties.delete);

module.exports = router;