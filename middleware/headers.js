function headers(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-auth-token"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  //"Access-Control-Allow-Headers" value="Content-Type" />
  //"Access-Control-Allow-Methods" value="GET, POST, PUT, DELETE, OPTIONS"
  next();
}

module.exports = headers;
