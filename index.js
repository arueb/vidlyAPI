const winston = require("winston");
const express = require("express");
const app = express();
// const startupDebugger = require('debug')('app:startup');
// const dbDebugger = require('debug')('app:db');

// const morgan = require('morgan');
// const helmet = require('helmet');
// const headers = require("./middleware/headers");

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, x-auth-token, X-Auth-Token"
//   );
//   next();
// });
// app.use(headers);

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/prod")(app);

// process.on('unhandledRejection', (ex) => {
//     throw ex; // winston will catch this as unhandled exception
// });

// process.on('uncaughtException', (ex) => {
//     console.log('WE GOT AN UNCAUGHT EXCEPTION!');
//     process.exit(1);
//     logger.error(ex.message, ex);
// });

// // use winston to write code above
// logger.exceptions.handle(
//     new transports.File({ filename: 'exceptions.log' })
//   );

// throw new Error('Something failed during startup!');

// two ways to get the environment variable
// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
// console.log(`app: ${app.get('env')}`)

// set environment in terminal using:
// export NODE_ENV=production (production can be anything)
// export NODE_ENV=development

// to turn on Debugger env variable in terminal: export DEBUG=app:startup
// or multiple namespaces: export DEBUG=app:startup,app:db
// or all namespaces: export DEBUG=app:*
// or turn off with: export DEBUG=
// or set/run in single command:  DEBUG=app:startup nodemon index.js

// if (app.get('env') === 'development') {
//     app.use(morgan('tiny'));
//     startupDebugger('Morgan enabled...');
// }

// app.set('view engine', 'pug');
// app.set('views', './views'); //default

// middleware
// app.use(express.urlencoded({ extended: true }));  // use if parsing urlEncoded forms to post data
// app.use(express.static('public'));
// app.use(helmet());
// app.use(logger);

// configuration (do not save passwords in config files -> use env variables)
// console.log(`Application Name: ${config.get('name')}`);
// console.log(`Mail Server: ${config.get('mail.host')}`);
// console.log(`Mail Password: ${config.get('mail.password')}`);

const port = process.env.PORT || 3900;
// const port = process.env.PORT;

console.log(process.env.NODE_ENV);
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port} ...`)
);
module.exports = server;
