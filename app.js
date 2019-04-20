const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const server1 = require('./server');
const defaultRouter = require('./routes/defaultRout');
const weatherRouter = require('./routes/weatherRout');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//routs
app.use('/', defaultRouter);
app.use('/weather', weatherRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

//start first server service
server1.startServer1(app);

// error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  let erroeMsg = err.message;
  console.log(erroeMsg)
  res.send(erroeMsg);
});

module.exports = app;
