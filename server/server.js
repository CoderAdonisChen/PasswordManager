const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {PasswordManager} = require('./models/pwdManager');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

//var {TestDB} = require('./models/dbTest');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

//sign up an account
app.post('/users/signup', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then((user) => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

//Get back the _id, with the token
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// POST /users/login {email, password}, and get back _id
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

//When log out, remove the token
app.delete('/users/logout', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});
//
// //sign up, insert a record
// app.post('/sign-up', (req, res) => {
//   var user = new PasswordManager({
//     username: req.body.username,
//     password: req.body.password
//   });
//
//   user.save().then((doc) => {
//     res.send(doc);
//   }, (e) => {
//     res.status(400).send(e);
//   });
// })
//
// //get all the records from the database
// //this function should be strictly restricted
// app.get('/require', (req, res) => {
//   PasswordManager.find().then((records) => {
//     res.send({records});
//   }, (e) => {
//     res.status(400).send(e);
//   });
// });

app.listen(port, () => {
  console.log(`Started on port ${port}`);
})

module.exports = {app};
