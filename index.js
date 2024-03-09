const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('/Users/senakanik/Desktop/stajbackend/stajbackend/src/routes/userRoutes.js');
const { MongoClient } = require('mongodb');

const app = express();

// MongoDB bağlantı URL'si
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Veritabanına bağlanma
async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('MongoDB\'ye başarıyla bağlandı.');
    } catch (error) {
        console.error('MongoDB bağlantısı sırasında bir hata oluştu:', error);
    }
}

connectToMongoDB();
app.use(bodyParser.json());
// Kullanıcı route'larını tanımlayın
app.use('/api', userRoutes);

// Sunucuyu dinlemeye başla
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
