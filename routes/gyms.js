const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { gymSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const Gym = require('../models/gym');

const validateGym = (req, res, next) => {
    const { error } = gymSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const gyms = await Gym.find({});
    res.render('gyms/index', { gyms })
}))

router.get('/new', (req, res) => {
    res.render('gyms/new')
})

router.post('/', validateGym, catchAsync(async (req, res, next) => {
    // if (!req.body.gym) throw new ExpressError('Invalid Gym Data', 400);
    const gym = new Gym(req.body.gym);
    await gym.save();
    req.flash('success', 'Successfully made a new gym!');
    res.redirect(`/gyms/${gym._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const gym = await Gym.findById(req.params.id).populate('reviews');
    res.render('gyms/show', { gym });
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const gym = await Gym.findById(req.params.id);
    res.render('gyms/edit', { gym })
}))

router.put('/:id', validateGym, catchAsync(async (req, res) => {
    const { id } = req.params;
    const gym = await Gym.findByIdAndUpdate(id, { ...req.body.gym });
    req.flash('success', 'Successfully updated gym!');
    res.redirect(`/gyms/${gym._id}`);
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Gym.findByIdAndDelete(id);
    res.redirect('/gyms');
}))

module.exports = router;