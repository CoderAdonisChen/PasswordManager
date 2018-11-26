var mongoose = require('mongoose');

const mngrSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    default: "123456"
  },
  status: {
    type: Boolean,
    default: false
  }
});

var PasswordManager = mongoose.model('PasswordManager', mngrSchema);

module.exports = {PasswordManager};
