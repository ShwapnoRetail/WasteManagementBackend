const mongoose = require('mongoose');

const logInfoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  loginLogoutHistory: [
    {
      date: {
        type: Date,
        required: true,
      },
      events: [
        {
          loginTime: Date,
          logoutTime: Date,
        },
      ],
    },
  ],
});

const LogInfo = mongoose.model('LogInfo', logInfoSchema);

module.exports = LogInfo;
