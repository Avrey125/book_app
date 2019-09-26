'use strict';

// dependencies
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const cors = require('cors');
// enviornment variable
require('dotenv').config();

//applications
const app = express();
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));


//express middleware
app.use(express.static('./public'));
app.use(express.urlencoded({extended:true}));

// dattabase setup 
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

app.set('view engine', 'ejs');


// routes
app.get('/', getBooks);
app.get('/pages/searches/new', (request, response) => {
  response.render('./pages/searches/new');
});

app.post('/searches', searchForBooks);
app.get('/books/:book_id', getOneBook)
app.get('pages/add/:book_index', saveOneBook)

app.use('*', (request, response) => response.render('pages/error'));


function Book(info, i) {
  const placeHolderImage = 'https://i.imgur.com/J5LVHEL.jpg';
  this.title = info.volumeInfo.title || 'no title available';
  this.authors = info.volumeInfo.authors || 'no author available';
  this.description = info.volumeInfo.description;
  this.image = info.volumeInfo.imageLinks.thumbnail;
  this.isbn = info.volumeInfo.industryIdentifiers.identifier;
  this.tempId = i;
}

let bookArr = [];

function saveOneBook(request, response) {
  const bookIndex = request.params.book_index;
  let sql = 'INSERT INTO books (title, author, description, image) VALUES ($1, $2, $3, $4)'
  let values = [bookArr[bookIndex].title, bookArr[bookIndex].authors, bookArr[bookIndex].image, bookArr[bookIndex].description]
  client.query(sql, values)

}

//========================================================================
function searchForBooks(request, response) {
  console.log(request.body.search);
  const searchName = request.body.search[0];
  const searchingFor = request.body.search[1];
  
  let url = `https://www.googleapis.com/books/v1/volumes?q=`;
  
  if(searchingFor === 'title'){
    console.log('in first if');
    url = url+`intitle:${searchName}`;
  }
  if(searchingFor === 'author'){
    console.log('in second if');
    url = url+`inauthor:${searchName}`;
  }
  
  superagent
  .get(url)
  .then(result => {
    let i = 0;
    return result.body.items.map(bookObj => {
      i++;
     return new Book(bookObj)
    });
  })
    .then(result => {
      response.render('./pages/searches/show', {bookArray: result})
    })
    .catch(error => handleError(error, response));
  }

  //=======================================================================================
  function handleError(error, response){
    response.render('pages/error', {error: 'oops'});
  }

  //==========================================================================================
  function getBooks(request, response){
    let sql = 'SELECT * from books;';
   client.query(sql)
    .then(sqlResults => {
      response.render('pages/index', {bookArray: sqlResults.rows})
    })
    .catch(error => handleError(error, response));
  }
  //============================================================================================
  function getOneBook(request, response) {
    const bookId = request.params.books_id;
    let sql = 'SELECT * FROM books WHERE id=$1;';
    let values = bookId;
    
     client.query(sql,values)
      .then(result => response.render('../pages/books/detail', {book: result.rows[0]}))
      .catch(error => handleError(error, response));
  }
