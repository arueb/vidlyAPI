const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');
const {Genre, validate} = require('../models/genre');

router.get('/', async (req, res) => {
    // throw new Error('Could not get the genres');
    const genres = await Genre.find().sort('name');
    res.send(genres);
}); 

router.post('/', auth, async (req, res) => {
    const {error} = validate(req.body);  // destructure to get error property of result in above line
    if (error) return res.status(400).send(error.details[0].message);
    
    // create the new genre object
    const genre = new Genre({ name: req.body.name });

    //insert into mongodb 
    await genre.save();
    res.send(genre);
});

router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    console.log('genre from get/":id', genre);
    if (!genre) return res.status(404).send('The genre with the given id was not found.');
    res.send(genre);
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);  // destructure to get error property of result in above line
    if (error) return res.status(400).send(error.details[0].message);
    
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { 
        new: true 
    });
    
    if (!genre) return res.status(404).send('The genre with the given id was not found.');
    res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) => {
    
    const genre = await Genre.findByIdAndRemove(req.params.id);
    
    if (!genre) return res.status(404).send('The genre with the given id was not found.');
    res.send(genre);
});


module.exports = router;