const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const blogRouter = require('./routes/blogRoutes');

// Start express app
const app = express();

app.enable('trust proxy');  // this is behind a front facing proxy
// alternative: app.set('trust proxy', true);


// GLOBAL MIDDLEWARES
// Implement CORS
app.use(cors());

// enable pre-flight request for DELETE 
app.options('*', cors());
// app.options('/api/v1/users/:id', cors());
// docs: https://expressjs.com/en/resources/middleware/cors.html
// https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request


// Serving static files
//app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


// Body parser, reading data from body into req.body
app.use(express.json({ limit: '900kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());


// Data sanitization against XSS
app.use(xss());


// ROUTES

app.use('/api/v1/users', userRouter);
app.use('/api/v1/blogs', blogRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
