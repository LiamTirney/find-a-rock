const express = require('express');
const router = express.Router();
const gyms = require('../controllers/gyms');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateGym, isAuthor } = require('../middleware');

const Gym = require('../models/gym');

router.get('/', catchAsync(gyms.index));

router.get('/new', isLoggedIn, gyms.renderNewForm);

router.post('/', isLoggedIn, validateGym, catchAsync(gyms.createGym));

router.get('/:id', catchAsync(gyms.showGym));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(gyms.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validateGym, catchAsync(gyms.updateGym));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(gyms.deleteGym));

module.exports = router;