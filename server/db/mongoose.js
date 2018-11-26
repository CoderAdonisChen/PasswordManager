var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/TestDB');
mongoose.connect('mongodb://localhost:27017/pwdmanager');

module.exports = {mongoose};
