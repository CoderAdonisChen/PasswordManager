const express = require('express');

const port = process.env.PORT || 3000;

var app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
