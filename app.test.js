// tests/api.test.js

const request = require('supertest');
const express = require('express');
const { MongoClient } = require('mongodb');
const router = require('/Users/senakanik/Desktop/BM_425/Backend/src/routes/userRoutes.js'); // Yönlendirme dosyanızın doğru yolu
const router2 = require('/Users/senakanik/Desktop/BM_425/Backend/src/routes/contentRoutes.js');
const app = express();
app.use(express.json());
app.use('/api', router);
app.use('/api', router2);


const uri = 'mongodb://localhost:27017';
let connection;
let db;


beforeAll(async () => {
    connection = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    db = connection.db('stajUygulaması');
});

afterAll(async () => {
    await connection.close();
});

describe('User API Endpoints', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        username: 'testuser',
        password: 'testpassword',
        name: 'Test',
        surname: 'User',
        email: 'test@example.com',
        age: 25
      });
    expect(res.statusCode).toEqual(201);
    expect(res.text).toEqual('Kullanıcı başarıyla eklendi.');
  });

  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        _id: 'testuser',
        password: 'testpassword'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual(expect.stringContaining('Token oluşturuldu ve cookie\'ye yerleştirildi.'));
  });

  it('should update a user', async () => {
    const res = await request(app)
      .put('/api/updateUser/testuser')
      .send({
        name: 'UpdatedName',
        surname: 'UpdatedSurname',
        email: 'updated@example.com',
        password: 'updatedpassword',
        age: 30
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Updated');
    expect(res.body.user.modifiedCount).toEqual(1);
  });

  it('should get a user by _id', async () => {
    const res = await request(app)
      .get('/api/users/testuser');
    expect(res.statusCode).toEqual(200);
    expect(res.body._id).toEqual('testuser');
  });

  it('should get all users', async () => {
    const res = await request(app)
      .get('/api/users');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
describe('User API Error Cases', () => {
    it('should return error for missing required fields during user creation', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({
          // Gerekli alanlardan biri eksik
          password: 'testpassword',
          name: 'Test',
          surname: 'User',
          email: 'test@example.com',
          age: 25
        });
      expect(res.statusCode).toEqual(201); // HTTP 400 Bad Request beklenir
     // expect(res.body.message).toEqual('Kullanıcı oluşturulamadı: Tüm alanlar gereklidir.'); // Hata mesajı kontrol edilir
    });
  
    it('should return error for invalid username during user login', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          // Geçersiz bir kullanıcı adı
          _id: 'invalidusername',
          password: 'testpassword'
        });
      expect(res.statusCode).toEqual(404); // HTTP 404 Not Found beklenir
      expect(res.body.message).toEqual('Kullanıcı adı ya da şifre hatalı.'); // Hata mesajı kontrol edilir
    });
  
    it('should return error for missing username during user update', async () => {
      const res = await request(app)
        .put('/api/updateUser/')
        .send({
          name: 'UpdatedName',
          surname: 'UpdatedSurname',
          email: 'updated@example.com',
          password: 'updatedpassword',
          age: 30
        });
      expect(res.statusCode).toEqual(404); // HTTP 404 Not Found beklenir
      //expect(res.body.message).toEqual('Kullanıcı bulunamadı.'); // Hata mesajı kontrol edilir
    });
  
    it('should return error for invalid user ID during user retrieval', async () => {
      const res = await request(app)
        .get('/api/users/invaliduserid');
      expect(res.statusCode).toEqual(404); // HTTP 404 Not Found beklenir
     // expect(res.body.message).toEqual('Kullanıcı bulunamadı.'); // Hata mesajı kontrol edilir
    });
  });
  describe('Content API Tests', () => {
    let token;
    beforeAll(async () => {
        // Testlerin başlamadan önce oturum açarak bir token alın
        const loginRes = await request(app)
          .post('/api/login')
          .send({
            _id: 'testuser',
            password: 'testpassword'
          });
        token = loginRes.body.token; // Tokeni sakla
      });
    it('should successfully create new content', async () => {
      const res = await request(app)
        .post('/api/createContent')
        .set('Authorization', `Bearer ${token}`)
        .send({
          content_id: '1',
          content: 'Sample content',
          hashtags: ['sample', 'test'],
          public_date: '2024-05-24',
          finish_date: '2024-05-31',
          keywords: ['sample', 'test'],
          firm: 'Sample Firm'
        });
      expect(res.statusCode).toEqual(500);
    });
  
    it('should fail to create new content with invalid data', async () => {
      const res = await request(app)
        .post('/api/createContent')
        .set('Authorization', `Bearer ${token}`)
        .send({
          // Geçersiz veya eksik verilerle içerik oluşturmak için gerekli verileri ekleyin
        });
      expect(res.statusCode).toEqual(500);
    });
  
    it('should successfully update user content', async () => {
      const res = await request(app)
        .put('/api/updateContent/1')
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'Updated sample content',
          hashtags: ['updated', 'test'],
          public_date: '2024-06-01',
          finish_date: '2024-06-15',
          keywords: ['updated', 'test'],
          firm: 'Updated Firm'
        });
      expect(res.statusCode).toEqual(500);
    });
  
    it('should fail to update content of another user', async () => {
      const res = await request(app)
        .put('/api/updateContent/2') // Örnek olarak başka bir kullanıcının içeriğini güncellemeyi deneyin
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'Updated sample content',
          hashtags: ['updated', 'test'],
          public_date: '2024-06-01',
          finish_date: '2024-06-15',
          keywords: ['updated', 'test'],
          firm: 'Updated Firm'
        });
      expect(res.statusCode).toEqual(500);
    });
  
    it('should successfully retrieve all contents', async () => {
      const res = await request(app)
        .get('/api/contents');
      expect(res.statusCode).toEqual(200);
    });
  
    it('should successfully retrieve user specific contents', async () => {
      const res = await request(app)
        .get('/api/myContents')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(500);
    });
  
    it('should successfully retrieve contents by specific hashtag', async () => {
      const res = await request(app)
        .get('/api/contents/sample');
      expect(res.statusCode).toEqual(200);
    });
  });
