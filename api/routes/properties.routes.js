const express = require('express');
const passport = require('passport');
const properties = require('../controllers/properties.controller');

const router = express.Router();
router.get('/', properties.getAll);
router.get('/:id', properties.getProperty);
router.post('/', passport.authenticate('jwt', {session: false}), properties.createProperty);
router.put('/:id', passport.authenticate('jwt', {session: false}), properties.updateProperty);
router.delete('/:id', passport.authenticate('jwt', {session: false}), properties.delete);

module.exports = router;