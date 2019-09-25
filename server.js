'use strict';

const express = require('express');
require('dotenv').config();

const pg = require('pg');
const cors = require('cors');
const superagent = require('superagent');

const app = express();

const PORT = process.env.PORT || 3001;


app.use(express.static('./public'));
app.use(express.urlencoded({extended:true}));

// dattabase setup 
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

app.set('view engine', 'ejs');



// app.get('/',(request, response) => {
//   response.render('pages/index');
// })

app.get('/', homePage);
app.get('')


app.post('/searches', searchForBooks);
// app.post('/searches/show', searchForBooks)

function homePage(request, response) {
  response.render('pages/index');
}

function getBooks(request, response){
  let sql = 'SELECT * from books;';

  return client.query(sql)
  .then(results => response.render('index', {bookArray: bookResults.rows}))
  .catch(handleError);
}

function getOneBook(render, response) {
  console.log(request.params.books_id)

  let sql = 'SELECT * FROM books WHERE id=$1;';
  let values = [request.params.books_id];

  return client.query(sql,values)
  .then(result => {
    return response.render('./pages/searches/index', {book: bookResults.rows[0]});
  })
  .catch(err => handleError(err, response));
}





// function newSearch(request, response) {
//   console.log(request.body);
//   response.render('pages/index')
// }
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
  
  superagent.get(url)
  .then(superagentResults => {
      const bookResults = (superagentResults.body.items.slice(0,10).map(book => {
        return new Book(book);
      }))

      response.render('./pages/searches/show', {bookArray: bookResults});
      console.log(superagentResults.body.items);
    })
    
  }
  
  
  function Book(info) {
    this.image = info.volumeInfo.imageLinks.thumbnail;
    this.title = info.volumeInfo.title || 'no title available';
    this.authors = info.volumeInfo.authors || 'no author available';
    this.description = info.volumeInfo.description;
    this.isbn = info.volumeInfo.industryIdentifiers.type;
  }
  

  function handleError(error, response){
    response.render('pages/error', {error: 'oops'});
  }

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
