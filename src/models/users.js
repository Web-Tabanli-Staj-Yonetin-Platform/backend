const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  kullanıcı_adı: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  şifre: { type: String, required: true },
  rol: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
