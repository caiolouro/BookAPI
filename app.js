var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser');

var db = mongoose.connect('mongodb://localhost/BookAPI');
var Book = require('./models/bookModel');
var app = express();

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//executada() por ser uma função, injetando a classe Book
var bookRouter = require('./routes/bookRoutes')(Book);

app.use('/api/books', bookRouter);

app.get('/', function(req, res) {
	res.send('welcome to my APP');
});

app.listen(port, function() {
	console.log('Running Node + Express + gulp on PORT: ' + port);
});