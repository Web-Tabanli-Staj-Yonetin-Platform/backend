const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  başlık: { type: String, required: true },
  açıklama: { type: String, required: true },
  şirket: { type: String, required: true },
  lokasyon: { type: String, required: true },
  gereksinimler: { type: String, required: true },
  sonBaşvuruTarihi: { type: Date, required: true }
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
