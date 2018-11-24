var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {TestDB} = require('./models/dbTest');

var app = express();

app.use(bodyParser.json());

app.post('/testdb', (req, res) => {
  var testCase = new TestDB({
    name: req.body.name
  });

  testCase.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.listen(3000, () => {
  console.log('Started on port 3000');
})
