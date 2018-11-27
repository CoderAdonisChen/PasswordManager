var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/TestDB');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pwdmanager');

module.exports = {mongoose};
