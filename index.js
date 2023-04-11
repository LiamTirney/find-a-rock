const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Gym = require('./models/gym');

mongoose.connect('mongodb://127.0.0.1:27017/find-a-rock');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/gyms', catchAsync(async (req, res) => {
    const gyms = await Gym.find({});
    res.render('gyms/index', { gyms })
}))

app.get('/gyms/new', (req, res) => {
    res.render('gyms/new')
})

app.post('/gyms', catchAsync(async (req, res, next) => {
    if (!req.body.campground) throw new ExpressError('Invalid Gym Data', 400);
    const gym = new Gym(req.body.gym);
    await gym.save();
    res.redirect(`/gyms/${gym._id}`)
}))

app.get('/gyms/:id', catchAsync(async (req, res) => {
    const gym = await Gym.findById(req.params.id);
    res.render('gyms/show', { gym });
}))

app.get('/gyms/:id/edit', catchAsync(async (req, res) => {
    const gym = await Gym.findById(req.params.id);
    res.render('gyms/edit', { gym })
}))

app.put('/gyms/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const gym = await Gym.findByIdAndUpdate(id, { ...req.body.gym });
    res.redirect(`/gyms/${gym._id}`);
}))

app.delete('/gyms/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Gym.findByIdAndDelete(id);
    res.redirect('/gyms');
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh no, something went wrong!'
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})