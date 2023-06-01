const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateGym, isAuthor } = require('../middleware');

const Gym = require('../models/gym');

router.get('/', catchAsync(async (req, res) => {
    const gyms = await Gym.find({});
    res.render('gyms/index', { gyms })
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('gyms/new');
})

router.post('/', isLoggedIn, validateGym, catchAsync(async (req, res, next) => {
    // if (!req.body.gym) throw new ExpressError('Invalid Gym Data', 400);
    const gym = new Gym(req.body.gym);
    gym.author = req.user._id
    await gym.save();
    req.flash('success', 'Successfully made a new gym!');
    res.redirect(`/gyms/${gym._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const gym = await Gym.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(gym);
    if (!gym) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/gyms');
    }
    res.render('gyms/show', { gym });
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const gym = await Gym.findById(id);
    if (!gym) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/gyms');
    }
    res.render('gyms/edit', { gym })
}))

router.put('/:id', isLoggedIn, isAuthor, validateGym, catchAsync(async (req, res) => {
    const { id } = req.params;
    const gym = await Gym.findByIdAndUpdate(id, { ...req.body.gym });
    req.flash('success', 'Successfully updated gym!');
    res.redirect(`/gyms/${gym._id}`);
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Gym.findByIdAndDelete(id);
    res.redirect('/gyms');
}))

module.exports = router;