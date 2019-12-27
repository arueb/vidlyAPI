const auth = require('../middleware/auth');
const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');
const {Movie, validate} = require('../models/movie');
const {Genre} = require('../models/genre');

router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('name');
    res.send(movies);
});

router.post('/', auth, async (req, res) => {
    const {error} = validate(req.body);  // destructure to get error property of result in above line
    if (error) return res.status(400).send(error.details[0].message);
    
    const genre = await Genre.findById(req.body.genreId); // verify genre is valid
    if (!genre) return res.status(400).send('Invalid genre.');

    // create the new movie object
    const movie = new Movie({ 
        title: req.body.title,
        genre: {
            _id: genre._id, 
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate 
    });

    //insert into mongodb 
    await movie.save();
    res.send(movie);
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);  // destructure to get error property of result in above line
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId); // verify genre is valid
    if (!genre) return res.status(400).send('Invalid genre.');

    const movie = await Movie.findByIdAndUpdate(req.params.id, { 
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate 
    }, { new: true });
    
    if (!movie) return res.status(404).send('The movie with the given id was not found.');
    res.send(movie);
});

router.delete('/:id', auth, async (req, res) => {
    
    const movie = await Movie.findByIdAndRemove(req.params.id);
    
    if (!movie) return res.status(404).send('The movie with the given id was not found.');
    res.send(movie);
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);

    if (!movie) return res.status(404).send('The movie with the given id was not found.');
    res.send(movie);
});

module.exports = router;