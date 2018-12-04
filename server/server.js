require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {PasswordManager} = require('./models/pwdManager');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

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

//Get all the records for the specific creator_id
app.get('/password-manager', authenticate, (req, res) => {
  PasswordManager.find({
    creator_id: req.user._id
  }).then((records) => {
    //var result = _(records).chain().head().pick('service').value();
    var result = [];
    _.forEach(records, function(value){
      var tmp = _.pick(value, ['service']);
      result = _.concat(result, tmp);
    });
    res.send(result);
  }, (e) => {
    res.status(400).send(e);
  });
});


//insert a record
app.post('/password-manager', authenticate, (req, res) => {
  var record = new PasswordManager({
    service: req.body.service,
    account: req.body.account,
    password: req.body.password,
    creator_id: req.user._id
  });

  record.save().then((doc) => {
    res.send(_.pick(doc, ['service', 'account']));
  }, (e) => {
    res.send(e);
  });
});

//delete a record
app.delete('/password-manager/:service', authenticate, (req, res) => {
  var serv = req.params.service;

  PasswordManager.findOneAndRemove({
    service: serv,
    creator_id: req.user._id
  }).then((doc) => {
    if (!doc) {
      return res.status(404).send();
    }
    res.send(_.pick(doc, ['service', 'account']));
  }).catch((e) => {
    res.status(400).send();
  });
});

//update a record
app.patch('/password-manager/:service', authenticate, (req, res) => {
  var serv = req.params.service;
  var body = _.pick(req.body, ['account', 'password']);

  PasswordManager.findOneAndUpdate({
    service: serv,
    creator_id: req.user._id
    }, {$set: {
      account: body.account,
      password: body.password
    }}, {new: true}).then((doc) => {
      if (!doc) {
        return res.status(404).send();
      }
      res.send(_.pick(doc, ['service', 'account']));
    }).catch((e) => {
      res.status(400).send();
    });
});

//get a record
app.get('/password-manager/:service', authenticate, (req, res) => {
  var serv = req.params.service;

  PasswordManager.findOne({
    service: serv,
    creator_id: req.user._id
    }, function(err, doc){
    if (err) {
      return res.status(404).send();
    }
    //res.send(doc);
    //only get the account and the encrypted password
    res.send(_.pick(doc, ['account', 'password']));
  });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
