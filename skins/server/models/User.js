const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String },
  registeredAt: { type: Date, default: Date.now },
  caseHistory: [{
    caseId: mongoose.Schema.Types.ObjectId,
    openedAt: Date,
    reward: Object
  }],
  stats: {
    totalOpened: { type: Number, default: 0 },
    totalWins: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model('User', UserSchema);