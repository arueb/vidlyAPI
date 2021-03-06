const mongoose = require('mongoose');
const Joi = require('joi');
const moment = require('moment');

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String, 
                required: true,
                minLength: 5,
                maxLength: 50
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required: true,
                minLength: 5,
                maxLength: 50
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minLength: 5,
                maxLength: 255
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

rentalSchema.statics.lookup = function(customerId, movieId){
    return this.findOne({
        'movie._id': movieId, 
        'customer._id': customerId 
      });
}

rentalSchema.methods.return = function() {
    this.dateReturned = new Date();
    // calculate rental fee using vanilla javascript:
    // rental.rentalFee = Math.floor(
    // (rental.dateReturned - rental.dateOut) / (1000 * 60 * 60 * 24))  * rental.movie.dailyRentalRate;
    // await rental.save();

    // calculate rental fee using moment.js:
    const rentalDays = moment().diff(this.dateOut, 'days'); 
    this.rentalFee =  rentalDays * this.movie.dailyRentalRate;
}

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental){
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };
    return Joi.validate(rental, schema);
}

exports.Rental = Rental; // short for module.exports.customer = customer;
exports.validate = validateRental;
