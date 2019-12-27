const config = require('config');

module.exports = function() {
    if (!config.get('jwtPrivateKey')){
        // console.log('FATAL ERROR: jwtPrivateKey is not defined.');
        // process.exit(1);
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
    }   
}