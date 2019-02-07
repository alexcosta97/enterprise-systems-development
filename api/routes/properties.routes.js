const express = require('express');
const passport = require('passport');
const properties = require('../controllers/properties.controller');
const multer = require('../config/multer');
const upload = multer.single('picture');

const router = express.Router();
router.get('/', properties.getAll);
router.get('/:id', properties.getProperty);
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    upload(req, res, function(err){
        if(err) req.file = null;
        properties.createProperty(req, res);
    });
});
router.put('/:id', passport.authenticate('jwt', {session: false}), multer.array('picture'), properties.updateProperty);
router.delete('/:id', passport.authenticate('jwt', {session: false}), properties.delete);

module.exports = router;