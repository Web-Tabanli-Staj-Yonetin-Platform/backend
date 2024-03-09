const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//user _ıd olarak username kullanmaktadır. Bu sebeple database de _id kullanıcı adıdır. Kullanıcı adı aynı olan kullanıcı oluşturulamamaktadır.
//Register için kullanılacak post işlemi...
router.post('/users', async (req, res) => {
    try {
        const {
            username,
            password,
            name,
            surname,
            email,
            age } = req.body; // POST isteğinden gelen veriler
        const database = client.db('stajUygulaması'); // Veritabanı adı
        const collection = database.collection('users'); // Koleksiyon adı

        // Veriyi ekleme
        const result = await collection.insertOne({_id: username, password,name,surname,email,age});
        console.log(`${result.insertedCount} adet kullanıcı eklendi.`);
        res.status(201).send('Kullanıcı başarıyla eklendi.');
    } catch (error) {
        console.error('Kullanıcı ekleme sırasında bir hata oluştu:', error);
        res.status(500).send('Kullanıcı eklenirken bir hata oluştu.');
    }
});
// //kullanıcı adına göre kullanıcı güncelleme
// router.post('/update', async (req, res) => {
//     try {
//         const { username } = req.params; // Güncellenecek kullanıcı adı
//         const { newValue } = req.body; // // POST isteğinden gelen veriler
//         const database = client.db('stajUygulaması'); // Veritabanı adı
//         const collection = database.collection('users'); // Koleksiyon adı

//         // Kullanıcıyı güncelleme
//         const result = await collection.updateOne(
//             { _id: username }, // Güncellenecek kullanıcıyı username'e göre bul
//             { $set: {newValue} } // Yeni bilgileri güncelle
//         );

//         console.log(`${result.modifiedCount} kullanıcı güncellendi.`);
//         res.status(200).send('Kullanıcı başarıyla güncellendi.');
//     } catch (error) {
//         console.error('Kullanıcı güncelleme sırasında bir hata oluştu:', error);
//         res.status(500).send('Kullanıcı güncellenirken bir hata oluştu.');
//     }
// });

// router.put('/update/:username', async (req, res) => {
//     try {
//         const {username} = req.params; // Güncellenecek kullanıcı adı
//         const updateFields = req.body; // Güncellenecek alanlar ve değerler

//         const database = client.db('stajUygulaması'); // Veritabanı adı
//         const collection = database.collection('users'); // Koleksiyon adı

//         // Kullanıcıyı güncelleme
//         const result = await collection.updateOne(
//             { _id: username}, // Güncellenecek kullanıcıyı username'e göre bul
//             { $set: updateFields } // Yeni değerleri güncelle
//         );
//         console.log(`${result.matchedCount}`);
//         console.log(`${result.modifiedCount} kullanıcı güncellendi.`);
//         res.status(200).send('Kullanıcı başarıyla güncellendi.');
//     } catch (error) {
//         console.error('Kullanıcı güncelleme sırasında bir hata oluştu:', error);
//         res.status(500).send('Kullanıcı güncellenirken bir hata oluştu.');
//     }
// });
//_id kullanılarak user güncelleme. 
router.put('/updateUser/:_id',  async (req, res) => {
    const database = client.db('stajUygulaması'); // Veritabanı adı
    const collection = database.collection('users'); // Koleksiyon adı

    const {_id} = req.params; 
    const {name, surname, email, password, age}=req.body;
    const userCheck = await collection.findOne({_id:_id})
        
        const user = await collection.updateOne(
            { _id: _id},
            {$set: {name ,surname, email, password,age}});
            if(!userCheck){
               return res.status(404).json({message:"yok"})
            }
        return res.status(200).json({ message: 'Updated', user }); 
 })

 router.get('/users/:_id', async (req, res) => {
    try {
        const { _id} = req.params; // Aranan kullanıcının adı

        const database = client.db('stajUygulaması'); // Veritabanı adı
        const collection = database.collection('users'); // Koleksiyon adı

        // Kullanıcıyı bul
        const user = await collection.findOne({ _id: _id });

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

//Kullanıcıları listelemek için kullanılacak Get işlemi.
router.get('/users', async (req, res) => {
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

module.exports = router;
