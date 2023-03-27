const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Gym = require('./models/gym');

mongoose.connect('mongodb://127.0.0.1:27017/find-a-rock')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Database connected');
})

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/makegym', async (req, res) => {
    const gym = new Gym({ title: 'My Backyard Rock Wall', description: 'Cheap climbing!' })
    await gym.save();
    res.send(gym)
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})