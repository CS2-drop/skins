const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
  title: String,
  image: String,
  description: String,
  items: [{
    name: String,
    image: String,
    rarity: String,
    odds: Number
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Case', CaseSchema);