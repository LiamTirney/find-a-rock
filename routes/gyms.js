const express = require('express');
const router = express.Router();
const gyms = require('../controllers/gyms');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateGym, isAuthor } = require('../middleware');
const multer  = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage })

const Gym = require('../models/gym');

router.route('/')
    .get(catchAsync(gyms.index))
    // .post(isLoggedIn, validateGym, catchAsync(gyms.createGym))
    .post(upload.array('image'), (req, res) => {
        console.log(req.body, req.files);
        res.send('IT WORKED?!');
    })

router.get('/new', isLoggedIn, gyms.renderNewForm);

router.route('/:id')
    .get(catchAsync(gyms.showGym))
    .put(isLoggedIn, isAuthor, validateGym, catchAsync(gyms.updateGym))
    .delete(isLoggedIn, isAuthor, catchAsync(gyms.deleteGym))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(gyms.renderEditForm));

module.exports = router;