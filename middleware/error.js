const winston = require('winston');
// const logger = require('../logger');

module.exports = function(err, req, res, next){
    winston.error(err.message, err);
    // logger.log({
    //     level: 'info',
    //     message: 'Hello distributed log files!'
    //   });
      
    //   logger.info('Hello again distributed logs');

    res.status(500).send('Something failed.');
}