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




app.listen(PORT, () => console.log(`Listening on ${PORT}`));