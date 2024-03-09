const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// //Yeni content oluşturmak için kullanılacak.
router.post('/createContent', async (req, res) => {
   try {
       const {
            content_id,
             content,
             creater,
             hashtags,
             public_date,
             finish_date,
             keywords,
             firm } = req.body; // POST isteğinden gelen veriler
         const database = client.db('stajUygulaması'); // Veritabanı adı
         const collection = database.collection('contents'); // Koleksiyon adı

        // Veriyi ekleme
         const result = await collection.insertOne(
            {
             content_id,
             content,
             creater,
             hashtags: Array.isArray(hashtags) ? hashtags : [hashtags], // Hashtags diziye dönüştürülüyor
             public_date,
             finish_date,
             keywords: Array.isArray(keywords) ? keywords : [keywords],
             firm});
         console.log(`${result.insertedCount} adet kullanıcı eklendi.`);
         res.status(201).send('Kullanıcı başarıyla eklendi.');
     } catch (error) {
         console.error('Kullanıcı ekleme sırasında bir hata oluştu:', error);
         res.status(500).send('Kullanıcı eklenirken bir hata oluştu.');
    }
});
router.put('/updateContent/:content_id',  async (req, res) => {
    const database = client.db('stajUygulaması'); // Veritabanı adı
    const collection = database.collection('contents'); // Koleksiyon adı

    const {content_id} = req.params; 
    const {content,creater,hashtags,public_date,finish_date,keywords,firm}=req.body;
    const contentCheck = await collection.findOne({content_id:content_id})
        
        const contents = await collection.updateOne(
            { content_id:content_id},
            {$set: {content,
                    creater,
                    hashtags: Array.isArray(hashtags) ? hashtags : [hashtags], // Hashtags diziye dönüştürülüyor
                    public_date,
                    finish_date,
                    keywords: Array.isArray(keywords) ? keywords : [keywords],
                    firm}});
            if(!contentCheck){
               return res.status(404).json({message:"böyle bir içerik bulunamadı."})
            }
        return res.status(200).json({ message: 'Updated', contents }); 
 })

router.get('/contents', async (req, res) => {
    try {
        const database = client.db('stajUygulaması'); // Veritabanı adı
        const collection = database.collection('contents'); // Koleksiyon adı

        // Belirli bir koşula göre belirli belgeleri getirme
        const content = await collection.find({}).toArray();
        res.json(content);
    } catch (error) {
        console.error('Belgeleri getirme sırasında bir hata oluştu:', error);
        res.status(500).send('Belgeleri getirirken bir hata oluştu.');
    }
});

module.exports = router;