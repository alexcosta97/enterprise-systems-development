const express = require('express');
const passport = require('passport');
const pictures = require('../controllers/pictures.controller');
const multer = require('../config/multer');

const router = express.Router();
router.get('/', pictures.getAll);
router.get('/:id', pictures.getPicture);
router.post('/', passport.authenticate('jwt', {session: false}), multer.single('picture'), pictures.createPicture);
router.put('/:id', passport.authenticate('jwt', {session: false}), multer.single('picture'), pictures.updatePicture);
router.delete('/:id', passport.authenticate('jwt', {session: false}), pictures.deletePicture);

module.exports = router;