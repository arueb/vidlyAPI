const winston = require('winston');
// const logger = require('../logger.js');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function(){
    const db = config.get('db');
    mongoose.connect(db, 
        {useNewUrlParser: true, 
        useCreateIndex: true,
        useUnifiedTopology: true })
    .then(() => winston.info(`Connected to ${db}...`))
    // .catch(err => logger.error('Could not connect to MongoDB...'));
    // global error handle in place to promise rejections
}