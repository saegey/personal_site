if (process.env.NEW_RELIC_LICENSE_KEY) {
  require('newrelic');
}

var express = require("express"),
  logfmt = require("logfmt"),
  routes = require("./routes"),
  bikes = require('./routes/bikes'),
  photos = require('./routes/photos'),
  bike_racing = require('./routes/bike_racing'),
  mongoose = require('mongoose'),
  paginate = require('express-paginate');

mongoose.connect(process.env.MONGOLAB_URI);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function callback() {
  console.log("Connected to DB");
});

var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

var app = express();

app.configure(function () {
  app.set('port', process.env.PORT || 5000);
  app.use(allowCrossDomain);
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(logfmt.requestLogger());
  app.use(app.router);
  app.use(paginate.middleware(10, 50));
});

app.configure('development', function () {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
  app.locals.pretty = true;
});

app.get('/', routes.index);
app.get('/v1/bikes', bikes.index);
app.get('/v1/bikes/spending', bikes.spending);
app.get('/v1/bikes/components', bikes.components);
app.get('/v1/bikes/racing', bike_racing.index);
app.get('/v1/bikes/:bike', bikes.show);
app.get('/v1/bikes/:bike/rides', bikes.rides);
app.get('/v1/photos/user', photos.user);
app.get('/v1/photos/liked', photos.liked);
app.get('/v1/photos/tag/:tag', photos.user);

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Express server listening on port %d in %s mode', port, app.get('env'));
});
