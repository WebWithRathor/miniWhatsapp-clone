const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session')
const passport = require('passport')
const MongoStore = require('connect-mongo');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  resave:false,
  saveUninitialized:false,
  secret: 'keyboard cat',
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://Devraj123:Devraj%40123@internshalaapiclone.91qzarm.mongodb.net/miniWhatsapp', // MongoDB URI
    collectionName: 'sessions', // Where session data will be stored
    ttl: 14 * 24 * 60 * 60, // Session expiration time (14 days)
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day in milliseconds
  }
}))
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser(usersRouter.serializeUser());
passport.deserializeUser(usersRouter.deserializeUser());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
