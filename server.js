const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');

const app = express();

// important for the req.body
app.use(bodyParser.json());

const database = {
  users: [
    {
      id: '123',
      name: 'kronos',
      email: 'kronos@example.com',
      password: '123456',
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
    res.json('success');
  } else {
    res.status(400).json('error logging in');
  }
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  database.users.push({
    id: '125',
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users);
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) res.status(404).json('No such user');
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) res.status(404).json('No such user');
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
