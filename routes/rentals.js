const auth = require('../middleware/auth');
const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');
const {Rental, validate} = require('../models/rental');
const {Movie} = require('../models/movie');
const {Customer} = require('../models/customer');
const Fawn = require('fawn');

Fawn.init(mongoose);

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

router.post('/', auth, async (req, res) => {
    const {error} = validate(req.body);  // destructure to get error property of result in above line
    if (error) return res.status(400).send(error.details[0].message);
    
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(404).send('The customer with the given id was not found.');
    
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(404).send('The movie with the given id was not found.');
  
    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.')

    // create the new rental object
    const rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    try {
        // group update/save operations into a task
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .run();

        res.send(rental);
    } catch(err){
        res.status(500).send('Something failed.');
    }
});

module.exports = router;