const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./src/routes/userRoutes');
const contentRoutes = require('./src/routes/contentRoutes');
const { MongoClient } = require('mongodb');
const cookieParser = require('cookie-parser');

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
async function startServer() {
    try {
      await connectToMongoDB();
      // Sunucuyu dinlemeye başla
        const PORT = process.env.PORT || 5005;
        app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
    } catch (error) {
      console.error('Server start error:', error);
    }
  }
  
startServer();

app.use(cookieParser());
app.use(bodyParser.json());
// Kullanıcı route'larını tanımlayın
app.use('/api', userRoutes);
app.use('/api', contentRoutes);



