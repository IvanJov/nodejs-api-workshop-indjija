var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bodyParser = require('body-parser');
var moment = require('moment');

var app = express();
app.use(bodyParser.json());

var db = mongoose.connect('mongodb://localhost:27017/books');

var Book = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  published: {
    type: Date,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  }
});

var BookModel = db.model('Book', Book);

app.get("/", function (req, res, next) {
  res.send('Hello World');
});

app.get("/api/books", function (req, res, next) {
  BookModel
    .find({})
    .exec(function(err, books) {
      if (err) {
        console.log(err);
      }

      res.json(books);
    });
});

app.post("/api/books", function (req, res, next) {
  var name = req.body.name;
  var description = req.body.description;
  var published = req.body.published;

  var book = new BookModel();
  book.name = name;
  book.description = description;
  book.published = moment(published, 'DD-MM-YYYY');

  book.save(function (err, book) {
    if(err) {
      console.log(err);
    }

    res.json(book);
  });
});

app.put("/api/books/:bookId", function (req, res, next) {
  var bookId = req.params.bookId;

  BookModel
    .findById(bookId)
    .exec(function(err, book) {
      if(err){
        console.log(err);
      }

      if (req.body.name) {
        book.name = req.body.name;
      }

      if(req.body.description) {
        book.description = req.body.description;
      }

      if(req.body.published) {
        book.published = moment(req.body.published);
      }

      book.save(function (err, book) {
        if(err){
          console.log(err);
        }

        res.json(book);
      });
    });
});

app.delete("/api/books/:bookId", function (req, res, next) {
  var bookId = req.params.bookId;

  BookModel
    .findById(bookId)
    .remove(function (err) {
      if(err) {
        console.log(err);
      }

      res.send("Success!");
    });
});

app.post("/api/books/:bookId/like", function (req, res, next) {
  var bookId = req.params.bookId;

  BookModel
    .findById(bookId)
    .exec(function(err, book) {
      if(err){
        console.log(err);
      }

      book.likes++;

      book.save(function (err, book) {
        if(err){
          console.log(err);
        }

        res.json(book);
      });
    });
});

// GET
// POST
// PUT
// DELETE

app.listen(3000, function() {
  console.log('Listening on port 3000');
});
