const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const InternProfile = require('../models/InternProfile');

const uri = 'mongodb://kaniksena7:12345@ac-fy1mo8v-shard-00-00.0lqminl.mongodb.net:27017,ac-fy1mo8v-shard-00-01.0lqminl.mongodb.net:27017,ac-fy1mo8v-shard-00-02.0lqminl.mongodb.net:27017/?replicaSet=atlas-92uvrv-shard-0&ssl=true&authSource=admin';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// Stajyer profili oluştur
router.post('/', async (req, res) => {
  try {
    const profile = new InternProfile(req.body);
    await profile.save();
    res.status(201).send(profile);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Tüm stajyer profillerini getir
router.get('/', async (req, res) => {
  try {
    const profiles = await InternProfile.find().populate('user_id eşleşilen_ilanlar başvurulan_ilanlar kabul_alınan_ilan ilan_değerlendirilme');
    res.send(profiles);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Belirli bir stajyer profilini getir
router.get('/:id', async (req, res) => {
  try {
    const profile = await InternProfile.findById(req.params.id).populate('user_id eşleşilen_ilanlar başvurulan_ilanlar kabul_alınan_ilan ilan_değerlendirilme');
    if (!profile) {
      return res.status(404).send();
    }
    res.send(profile);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Stajyer profilini güncelle
router.patch('/:id', async (req, res) => {
  try {
    const profile = await InternProfile.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!profile) {
      return res.status(404).send();
    }
    res.send(profile);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Stajyer profilini sil
router.delete('/:id', async (req, res) => {
  try {
    const profile = await InternProfile.findByIdAndDelete(req.params.id);
    if (!profile) {
      return res.status(404).send();
    }
    res.send(profile);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
