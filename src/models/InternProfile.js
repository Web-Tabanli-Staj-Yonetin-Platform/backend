const mongoose = require('mongoose');

const internProfileSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isim: { type: String, required: true },
  soy_isim: { type: String, required: true },
  telefon_numarası: { type: String, required: true },
  adres: { type: String, required: true },
  üniversite: { type: String, required: true },
  bölüm: { type: String, required: true },
  sınıf: { type: String, required: true },
  ortalama: { type: Number, required: true },
  iş_deneyimleri: { type: String, required: true },
  çalışmak_istediği_alan: { type: String, required: true },
  becerileri: { type: String, required: true },
  yabancı_diller: { type: String, required: true },
  takım_çalışması_becerisi: { type: Boolean, required: true },
  iletişim_becerisi: { type: Boolean, required: true },
  analitik_beceri: { type: Boolean, required: true },
  hobiler: { type: String, required: true },
  eşleşilen_ilanlar: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  başvurulan_ilanlar: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  kabul_alınan_ilan: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  ilan_değerlendirilme: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobEvaluation' }]
});

const InternProfile = mongoose.model('InternProfile', internProfileSchema);

module.exports = InternProfile;
