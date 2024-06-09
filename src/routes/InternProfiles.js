const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const InternProfile = require('../models/InternProfile');

const uri = 'mongodb://kaniksena7:12345@ac-fy1mo8v-shard-00-00.0lqminl.mongodb.net:27017,ac-fy1mo8v-shard-00-01.0lqminl.mongodb.net:27017,ac-fy1mo8v-shard-00-02.0lqminl.mongodb.net:27017/?replicaSet=atlas-92uvrv-shard-0&ssl=true&authSource=admin';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Stajyer profili oluştur
router.post('/', async (req, res) => {
  try {
    const profiles = new InternProfile (req.body); // Profile verilerini array olarak alın
    const database = client.db('stajUygulaması'); // Veritabanı adı
    const collection = database.collection('InternProfile'); // Koleksiyon adı

    // Veriyi ekleme
    const result = await collection.insertMany(profiles);

    console.log(`${result.insertedCount} adet kullanıcı eklendi.`);
    res.status(201).send('Kullanıcılar başarıyla eklendi.');
  } catch (error) {
    console.error('Kullanıcı ekleme sırasında bir hata oluştu:', error);
    res.status(500).send('Kullanıcı eklenirken bir hata oluştu.');
  }
});

// Tüm stajyer profillerini getir
router.get('/', async (req, res) => {
  try {
    const database = client.db('stajUygulaması'); // Veritabanı adı
    const collection = database.collection('InternProfile'); // Koleksiyon adı
    const profiles = await collection.find({}).toArray();
    res.json(profiles);
  } catch (error) {
    console.error('Belgeleri getirme sırasında bir hata oluştu:', error);
    res.status(500).send('Belgeleri getirirken bir hata oluştu.');
  }
});

// Belirli bir stajyer profilini getir
router.get('/:id', async (req, res) => {
  try {
    const database = client.db('stajUygulaması'); // Veritabanı adı
    const collection = database.collection('InternProfile'); // Koleksiyon adı
    const profile = await collection.findOne({ _id: new MongoClient.ObjectId(req.params.id) });

    if (!profile) {
      return res.status(404).send('Profil bulunamadı');
    }
    res.json(profile);
  } catch (error) {
    console.error('Profil getirme sırasında bir hata oluştu:', error);
    res.status(500).send('Profil getirilirken bir hata oluştu.');
  }
});

// Belirli becerilere göre stajyer profillerini getir
router.get('/beceri/:beceri', async (req, res) => {
  try {
    const { beceri } = req.params;
    const database = client.db('stajUygulaması'); // Veritabanı adı
    const collection = database.collection('InternProfile'); // Koleksiyon adı
    const profiles = await collection.find({ becerileri: { $regex: beceri, $options: 'i' } }).toArray();
    res.json(profiles);
  } catch (error) {
    console.error('Belgeleri getirme sırasında bir hata oluştu:', error);
    res.status(500).send('Belgeleri getirirken bir hata oluştu.');
  }
});

// Stajyer profilini güncelle
router.patch('/:id', async (req, res) => {
  try {
    const database = client.db('stajUygulaması'); // Veritabanı adı
    const collection = database.collection('InternProfile'); // Koleksiyon adı
    const profile = await collection.findOneAndUpdate(
      { _id: new MongoClient.ObjectId(req.params.id) },
      { $set: req.body },
      { returnOriginal: false }
    );

    if (!profile.value) {
      return res.status(404).send('Profil bulunamadı');
    }
    res.json(profile.value);
  } catch (error) {
    console.error('Profil güncelleme sırasında bir hata oluştu:', error);
    res.status(400).send('Profil güncellenirken bir hata oluştu.');
  }
});

// Stajyer profilini sil
router.delete('/:id', async (req, res) => {
  try {
    const database = client.db('stajUygulaması'); // Veritabanı adı
    const collection = database.collection('InternProfile'); // Koleksiyon adı
    const result = await collection.deleteOne({ _id: new MongoClient.ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).send('Profil bulunamadı');
    }
    res.send('Profil silindi');
  } catch (error) {
    console.error('Profil silme sırasında bir hata oluştu:', error);
    res.status(500).send('Profil silinirken bir hata oluştu.');
  }
});

module.exports = router;
