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
app.set('view engine', 'ejs');

app.get('/',(request, response) => {
    response.render('pages/index');
})

app.post('/searches' , searchForBooks);
app.post('/searches/show', searchForBooks)


function newSearch(request, response) {
    console.log(request.body);
    response.render('pages/index')
}

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
      response.send(bookResults)
      console.log(superagentResults.body.items);
        
    })
}


function Book(info) {
    this.title = info.volumeInfo.title || 'no title available';
}

app.listen(PORT, () => console.log(`Listening on ${PORT}`));