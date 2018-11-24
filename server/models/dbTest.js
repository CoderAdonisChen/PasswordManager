var mongoose = require('mongoose');

var TestDB = mongoose.model('Test', {
  name: {
    type: String,
    required: true,
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

module.exports = {TestDB};
