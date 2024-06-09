const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const secretKey = 'yourSecretKey';

const uri = 'mongodb://kaniksena7:12345@ac-fy1mo8v-shard-00-00.0lqminl.mongodb.net:27017,ac-fy1mo8v-shard-00-01.0lqminl.mongodb.net:27017,ac-fy1mo8v-shard-00-02.0lqminl.mongodb.net:27017/?replicaSet=atlas-92uvrv-shard-0&ssl=true&authSource=admin';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Kullanıcı oluştur
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    const database = client.db('stajUygulaması'); // Veritabanı adı
    const collection = database.collection('users'); // Koleksiyon adı

    // Veriyi ekleme
    const result = await collection.insertMany(user);
    console.log(`${result.insertedCount} adet kullanıcı eklendi.`);
    res.status(201).send('Kullanıcı başarıyla eklendi.');
} catch (error) {
    console.error('Kullanıcı ekleme sırasında bir hata oluştu:', error);
    res.status(500).send('Kullanıcı eklenirken bir hata oluştu.');
  }
});

// Tüm kullanıcıları getir
router.get('/', async (req, res) => {
    try {
        const database = client.db('stajUygulaması'); // Veritabanı adı
        const collection = database.collection('users'); // Koleksiyon adı

        // Belirli bir koşula göre belirli belgeleri getirme
        const users = await collection.find({}).toArray();
        res.json(users);
    } catch (error) {
        console.error('Belgeleri getirme sırasında bir hata oluştu:', error);
        res.status(500).send('Belgeleri getirirken bir hata oluştu.');
    }
});

router.get('/find/company', async (req, res) => {
    try {
      // const { kullanıcı_adı} = req.params; // Aranan kullanıcının adı
        //console.log(kullanıcı_adı);

        const database = client.db('stajUygulaması'); // Veritabanı adı
        const collection = database.collection('users'); // Koleksiyon adı

        // Kullanıcıyı bul
        const user = await collection.find({ rol: "company" }).toArray();

        if (!user) {
            res.status(404).send('Kullanıcı bulunamadı.');
            return;
        }

        res.status(200).json(user); // Kullanıcıyı JSON formatında yanıtla
    } catch (error) {
        console.error('Kullanıcı arama sırasında bir hata oluştu:', error);
        res.status(500).send('Kullanıcı aranırken bir hata oluştu.');
    }
});
router.get('/find/intern', async (req, res) => {
    try {
      // const { kullanıcı_adı} = req.params; // Aranan kullanıcının adı
        //console.log(kullanıcı_adı);

        const database = client.db('stajUygulaması'); // Veritabanı adı
        const collection = database.collection('users'); // Koleksiyon adı

        // Kullanıcıyı bul
        const user = await collection.find({ rol: "intern" }).toArray();

        if (!user) {
            res.status(404).send('Kullanıcı bulunamadı.');
            return;
        }

        res.status(200).json(user); // Kullanıcıyı JSON formatında yanıtla
    } catch (error) {
        console.error('Kullanıcı arama sırasında bir hata oluştu:', error);
        res.status(500).send('Kullanıcı aranırken bir hata oluştu.');
    }
});
router.get('/find/:kullanıcı_adı', async (req, res) => {
    try {
      // const { kullanıcı_adı} = req.params; // Aranan kullanıcının adı
        //console.log(kullanıcı_adı);
        const { kullanıcı } = req.params;
        const database = client.db('stajUygulaması'); // Veritabanı adı
        const collection = database.collection('users'); // Koleksiyon adı

        // Kullanıcıyı bul
        const user = await collection.find({ kullanıcı_adı: kullanıcı }).toArray();

        if (!user) {
            res.status(404).send('Kullanıcı bulunamadı.');
            return;
        }

        res.status(200).json(user); // Kullanıcıyı JSON formatında yanıtla
    } catch (error) {
        console.error('Kullanıcı arama sırasında bir hata oluştu:', error);
        res.status(500).send('Kullanıcı aranırken bir hata oluştu.');
    }
});
// Kullanıcıyı güncelle
router.patch('/:kullanıcı_adı', async (req, res) => {
  try {
    const database = client.db('stajUygulaması'); // Veritabanı adı
    const collection = database.collection('users'); // Koleksiyon adı
    const user = await collection.findByIdAndUpdate(req.params.kullanıcı_adı, req.body, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});
router.post('/login', async (req, res) => {
    try {

        const { kullanıcı_adı, şifre} = req.body; // POST isteğinden gelen veriler
        const database = client.db('stajUygulaması'); // Veritabanı adı
        const collection = database.collection('users'); // Koleksiyon adı

        const userCheck = await collection.findOne({kullanıcı_adı:kullanıcı_adı, şifre:şifre});

        if(!userCheck){
           return res.status(404).json({message:"Kullanıcı adı ya da şifre hatalı."})
        }

        const token = jwt.sign({ kullanıcı_adı }, secretKey, { expiresIn: '1h' });
        res.cookie('authToken', token, {
           httpOnly: true,
           secure: true, // Sadece HTTPS üzerinden gönder
           sameSite: 'strict' // Sadece aynı siteye gönder
       }).send('Token oluşturuldu ve cookie\'ye yerleştirildi.'); // Token 1 saat geçerli olacak şekilde oluşturuldu
    } catch (error) {
        console.error('Kullanıcı güncelleme sırasında bir hata oluştu:', error);
        res.status(500).send('Kullanıcı güncellenirken bir hata oluştu.');
    }
});

// Kullanıcıyı sil
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
