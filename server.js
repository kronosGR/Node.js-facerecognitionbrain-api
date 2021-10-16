const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const PASS = require('./password.js');

const knex = require('knex');
const { response } = require('express');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: PASS,
    database: 'smart-brain',
  },
});

const app = express();

// important for the req.body
app.use(bodyParser.json());
app.use(cors());

const database = {
  users: [
    {
      id: '123',
      name: 'kronos',
      email: 'kronos@example.com',
      password: '12',
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: '987',
      hash: '',
      email: 'kronos@example.com',
    },
  ],
};

app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/signin', (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json('error logging in');
  }
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  db('users')
    .returning('*')
    .insert({
      email: email,
      name: name,
      joined: new Date(),
    })
    .then((user) => {
      res.json(user[0]);
    })
    .catch((err) => res.status(400).json('unable to register'));
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*')
    .from('users')
    .where({ id: id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(404).json('Not found');
      }
    })
    .catch((err) => res.status(400).json('Error getting user'));
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => {
      res.json(entries)[0];
    })
    .catch((err) => res.status(400).json('Unable to get entries'))
});

// bcrypt.hash(password, null, null, (err, hash) => {
//   console.log(hash);
// });

// bcrypt.compare('veggie', '$2a$10$XpdcPD6fheb0LKlpk7p8uexqlZOAl86zPSvV0s4pMC6oXP3WjMS5a',  (err, res) => {
//   console.log('firs guess',res)
// });

// bcrypt.hash("veggies", null, null,  (err, res) => {

// })

app.listen(3000, () => {
  console.log('listening on port 3000');
});

/*
/
/signin POST = success/fail
/register POST = user{}
/profile/:userId GET = user{}
/image PUT = user{}
*/
