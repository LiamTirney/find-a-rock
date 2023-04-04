const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Gym = require('../models/gym');

mongoose.connect('mongodb://127.0.0.1:27017/find-a-rock');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

// pass in an array and return a random element from that array
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Gym.deleteMany({});
    // const g = new Gym({ title: 'purple field' });
    // await g.save();
    for(let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10;
        const gym = new Gym({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/random/?rock-climbing',
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti esse hic iste tempora impedit, voluptate corporis temporibus recusandae molestias excepturi eveniet amet, atque rem, dolor eos soluta ipsa! Quisquam, repellendus!',
            price 
        })
        await gym.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})