// const log = require('../logger');

// new aproach
const winston = require('winston');
// const { transports } = require('winston');
// require('winston-mongodb');
require('express-async-errors');


module.exports = function(){

    winston.add(new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      }));
    winston.add(new winston.transports.File({ filename: 'combined.log' }));
    // winston.add(new winston.transports.MongoDb({db: 'mongodb://localhost/vidly'}));
    // use winston to write code above 
    winston.exceptions.handle(
        new winston.transports.File({ filename: 'exceptions.log' }),
        new winston.transports.Console({ colorize:  true, prettyPrint: true })
    );

    process.on('unhandledRejection', (ex) => {
        throw ex; // winston will catch this as unhandled exception
    });
}

