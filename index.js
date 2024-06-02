const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./src/routes/userRoutes');
const contentRoutes = require('./src/routes/contentRoutes');
const { MongoClient } = require('mongodb');
const cookieParser = require('cookie-parser');

const app = express();

// MongoDB bağlantı URL'si
const uri = 'mongodb://kaniksena7:12345@ac-fy1mo8v-shard-00-00.0lqminl.mongodb.net:27017/?replicaSet=atlas-92uvrv-shard-0&ssl=true&authSource=admin';
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
        const PORT = process.env.PORT || 5010;
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



