var mongoose = require('mongoose');

const mngrSchema = new mongoose.Schema({
  service: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  account: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  //actuall they're encrypted password
  password: {
    type: String,
    required: true
  },
  creator_id: {
    type: mongoose.Schema.Types.ObjectId,
    requried: true
  }
});

var PasswordManager = mongoose.model('PasswordManager', mngrSchema);

module.exports = {PasswordManager};
