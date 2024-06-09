const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./src/routes/userRoutes');
const contentRoutes = require('./src/routes/contentRoutes');
const userRouter = require('./src/routes/users.js')
const internProfileRouter = require('./src/routes/InternProfiles.js')
const { MongoClient } = require('mongodb');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// MongoDB bağlantı URL'si
const uri = 'mongodb://kaniksena7:12345@ac-fy1mo8v-shard-00-00.0lqminl.mongodb.net:27017,ac-fy1mo8v-shard-00-01.0lqminl.mongodb.net:27017,ac-fy1mo8v-shard-00-02.0lqminl.mongodb.net:27017/?replicaSet=atlas-92uvrv-shard-0&ssl=true&authSource=admin';
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
const corsOptions = {
  origin: 'http://localhost:3000', // İzin verilen kaynak
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(bodyParser.json());
// Kullanıcı route'larını tanımlayın
app.use('/api', userRoutes);
app.use('/api', contentRoutes);
app.use('/users', userRouter);
app.use('/internProfiles', internProfileRouter);



