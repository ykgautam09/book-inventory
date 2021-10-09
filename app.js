const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('morgan');
const indexRoute = require('./routes/index');


// configurations
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(logger('dev'));

// public folder
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));


// Routes
app.use('/', indexRoute);


// Server Set-up
app.listen(process.env.SERVER_PORT || '5000', (err) => {
    if (err) console.log(err);
    console.log('Server Up and Running at localhost:5000/');
})


module.exports = app;