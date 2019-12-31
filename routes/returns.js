const express = require('express');
const router =  express.Router();
const auth = require('../middleware/auth');
const {Rental} = require('../models/rental');
const {Movie} = require('../models/movie');



router.post('/', auth, async (req, res) => {
  if (!req.body.customerId) return res.status(400).send('customerId not provided');
  if (!req.body.movieId) return res.status(400).send('movieId not provided');
  
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send('Rental not found');
  if (rental.dateReturned) return res.status(400).send('Return already processed');
  
  rental.return();
  await rental.save();

  // use "update first" approach
  await Movie.update({_id: rental.movie._id}, {
    $inc: { numberInStock: 1}
  });

  // const movie = await Movie.findById(req.body.movieId);
  // movie.numberInStock++; 
  // await movie.save();

  // return res.status(200).send(rental);
  return res.send(rental); // express sets 200 status by default
}); 

module.exports = router;