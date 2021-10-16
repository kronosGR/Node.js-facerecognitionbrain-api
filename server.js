const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const PASS = require('./password.js');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const knex = require('knex');
const { response } = require('express');

const db = knex({
  client: 'pg',
  connection: {
    host: 'postgresql-solid-96360',
    user: 'postgres',
    password: PASS,
    database: 'smart-brain',
  },
});

const app = express();

// important for the req.body
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json('success');
});

app.post('/signin', (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.get('/profile/:id', (req, res) => {
  profile.handleProfile(req, res, db);
});

app.put('/image', (req, res) => {
  image.handleImage(req, res, db);
});

app.post('/imageurl', (req, res) => {
  image.handleApiCall(req, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT);
});
