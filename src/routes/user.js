const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const secretKey = "yourSecretKey";
const User = require("../models/user");
const Intern = require("../models/intern");
const Company = require("../models/company");
const config = require("config");
const moment = require("moment");
const { authenticateUser } = require("../../middlewares/autenticateUser");

//user _ıd olarak username kullanmaktadır. Bu sebeple database de _id kullanıcı adıdır. Kullanıcı adı aynı olan kullanıcı oluşturulamamaktadır.
//Register için kullanılacak post işlemi...
router.post("/register", async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    // Basic validation
    if (!username) {
      return res.status(400).json({ response: false, error: "Kullanıcı adı gerekli." });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({
        response: false,
        error: "Password must be at least 6 characters long.",
      });
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ response: false, error: "Geçersiz E-posta adresi." });
    }
    if (!role || (role !== "company" && role !== "intern")) {
      return res.status(400).json({
        response: false,
        error: "Role 'intern' veya 'company' olmalıdır.",
      });
    }

    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ response: false, error: "Bu e-posta zaten var." });
    }

    const user1 = await User.findOne({ username: username });
    if (user1) {
      return res.status(400).json({ response: false, error: "Bu username zaten var." });
    }

    const newUser = await User.create({
      username,
      password,
      email,
      role,
    });
    if (role === "intern") {
      await Intern.create({
        user: newUser._id,
      });
    }

    if (role === "company") {
      await Company.create({
        user: newUser._id,
      });
    }

    res.status(201).send({ response: true, message: "Kullanıcı başarıyla eklendi." });
  } catch (error) {
    console.error("Kullanıcı eklenirken hata oluştu:", error);
    res.status(500).send("Kullanıcı eklenirken bir hata oluştu.");
  }
});
//kullanıcı adına göre kullanıcı güncelleme
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      username,
      password,
    });

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı adı ya da şifre hatalı." });
    }
    const { privateKey, issuer, expirationInMinutes } = config.get("jwtSettings");
    const expiresAt = moment().add(expirationInMinutes, "minutes").unix();
    const company = await Company.findOne({ user: user._id });
    const intern = await Intern.findOne({ user: user._id });
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        expAt: expiresAt,
        company: company?._id,
        intern: intern?._id,
        issuer,
      },
      privateKey,
      { expiresIn: "3h" }
    );

    res.send({ response: true, accessToken: token, role: user.role, expiresAt }); // Token 1 saat geçerli olacak şekilde oluşturuldu
  } catch (error) {
    console.error("Kullanıcı güncelleme sırasında bir hata oluştu:", error);
    res.status(500).send("Kullanıcı güncellenirken bir hata oluştu.");
  }
});

router.get("/profile", authenticateUser, async (req, res) => {
  try {
    const { user } = req;
    const { role } = user;
    let profile;
    if (role === "intern") {
      profile = await Intern.findOne({ user: user.id });
    } else if (role === "company") {
      profile = await Company.findOne({ user: user.id });
    }

    res.status(200).json({ user, profile });
  } catch (error) {
    console.error("Kullanıcı profili getirme sırasında bir hata oluştu:", error);
    res.status(500).send("Kullanıcı profili getirirken bir hata oluştu.");
  }
});

router.put("/intern-profile", authenticateUser, async (req, res) => {
  try {
    const { user } = req;
    const {
      skills,
      languages,
      birthDate,
      teamWorkSkill,
      communicationSkill,
      analyticalSkill,
      department,
      class: userClass,
      average,
      hobbies,
    } = req.body;
    if (user.role !== "intern") {
      return res.status(403).json({ response: false, error: "Bu profili güncelleme yetkiniz yok." });
    }
    // Basic validation
    if (skills && !Array.isArray(skills)) {
      return res.status(400).json({ response: false, error: "Beceriler bir string dizisi olmalıdır." });
    }
    if (hobbies && !Array.isArray(hobbies)) {
      return res.status(400).json({ response: false, error: "Hobiler bir string dizisi olmalıdır." });
    }
    if (languages && !Array.isArray(languages)) {
      return res.status(400).json({ response: false, error: "Diller bir string dizisi olmalıdır." });
    }
    if (teamWorkSkill && typeof teamWorkSkill !== "string") {
      return res.status(400).json({ response: false, error: "Takım çalışması becerisi string olmalıdır." });
    }
    if (communicationSkill && typeof communicationSkill !== "string") {
      return res.status(400).json({ response: false, error: "İletişim becerisi string olmalıdır." });
    }
    if (analyticalSkill && typeof analyticalSkill !== "string") {
      return res.status(400).json({ response: false, error: "Analitik becerisi string olmalıdır." });
    }
    if (birthDate && typeof birthDate !== "string") {
      return res.status(400).json({ response: false, error: "birthDate string olmalıdır." });
    }
    if (department && typeof department !== "string") {
      return res.status(400).json({ response: false, error: "Bölüm string olmalıdır." });
    }
    if (userClass && typeof userClass !== "string") {
      return res.status(400).json({ response: false, error: "Sınıf string olmalıdır." });
    }
    if (average && (typeof average !== "number" || isNaN(average))) {
      return res.status(400).json({ response: false, error: "Ortalama bir sayı olmalıdır." });
    }

    const dbUser = await User.findOne({ _id: user.id });
    if (!dbUser) {
      return res.status(404).json({ response: false, error: "Kullanıcı bulunamadı." });
    }

    const profile = await Intern.findOneAndUpdate({ user: dbUser._id }, req.body, {
      new: true,
    });

    res.status(200).json({ response: true, profile });
  } catch (error) {
    console.error("Kullanıcı profili güncellenirken hata oluştu:", error);
    res.status(500).json({ response: false, error: "Kullanıcı profili güncellenirken bir hata oluştu." });
  }
});

router.put("/company-profile", authenticateUser, async (req, res) => {
  try {
    const { user } = req;
    const { companyName, about, phoneNumber, faxNumber, address, sector, taxNumber } = req.body;
    console.log(req.body);
    if (user.role !== "company") {
      return res.status(403).json({ response: false, error: "Bu profili güncelleme yetkiniz yok." });
    }

    // Basic validation
    if (companyName && typeof companyName !== "string") {
      return res.status(400).json({ response: false, error: "Şirket ismi string olmalıdır." });
    }
    if (about && typeof about !== "string") {
      return res.status(400).json({ response: false, error: "Hakkında bölümü string olmalıdır." });
    }
    if (phoneNumber && typeof phoneNumber !== "string") {
      return res.status(400).json({ response: false, error: "Telefon numarası string olmalıdır." });
    }
    if (faxNumber && typeof faxNumber !== "string") {
      return res.status(400).json({ response: false, error: "Fax numarası string olmalıdır." });
    }
    if (address && typeof address !== "string") {
      return res.status(400).json({ response: false, error: "Adres string olmalıdır." });
    }
    if (sector && typeof sector !== "string") {
      return res.status(400).json({ response: false, error: "Sektör string olmalıdır." });
    }
    if (taxNumber && typeof taxNumber !== "string") {
      return res.status(400).json({ response: false, error: "Vergi numarası string olmalıdır." });
    }

    const dbUser = await User.findOne({ _id: user.id });
    if (!dbUser) {
      return res.status(404).json({ response: false, error: "Kullanıcı bulunamadı." });
    }

    const profile = await Company.findOneAndUpdate({ user: dbUser._id }, req.body, {
      new: true,
    });

    res.status(200).json({ response: true, profile });
  } catch (error) {
    console.error("Şirket profili güncellenirken hata oluştu:", error);
    res.status(500).json({ response: false, error: "Şirket profili güncellenirken bir hata oluştu." });
  }
});

//_id kullanılarak user güncelleme.
router.put("/updateUser/:_id", async (req, res) => {
  const database = client.db("stajUygulaması"); // Veritabanı adı
  const collection = database.collection("users"); // Koleksiyon adı

  const { _id } = req.params;
  const { name, surname, email, password, age } = req.body;
  const userCheck = await collection.findOne({ _id: _id });

  const user = await collection.updateOne({ _id: _id }, { $set: { name, surname, email, password, age } });
  if (!userCheck) {
    return res.status(404).json({ message: "yok" });
  }
  return res.status(200).json({ message: "Updated", user });
});

router.get("/users/:_id", async (req, res) => {
  try {
    const { _id } = req.params; // Aranan kullanıcının adı

    const database = client.db("stajUygulaması"); // Veritabanı adı
    const collection = database.collection("users"); // Koleksiyon adı

    // Kullanıcıyı bul
    const user = await collection.findOne({ _id: _id });

    if (!user) {
      res.status(404).send("Kullanıcı bulunamadı.");
      return;
    }

    res.status(200).json(user); // Kullanıcıyı JSON formatında yanıtla
  } catch (error) {
    console.error("Kullanıcı arama sırasında bir hata oluştu:", error);
    res.status(500).send("Kullanıcı aranırken bir hata oluştu.");
  }
});

//Kullanıcıları listelemek için kullanılacak Get işlemi.
router.get("/users", async (req, res) => {
  try {
    const database = client.db("stajUygulaması"); // Veritabanı adı
    const collection = database.collection("users"); // Koleksiyon adı

    // Belirli bir koşula göre belirli belgeleri getirme
    const users = await collection.find({}).toArray();
    res.json(users);
  } catch (error) {
    console.error("Belgeleri getirme sırasında bir hata oluştu:", error);
    res.status(500).send("Belgeleri getirirken bir hata oluştu.");
  }
});

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

module.exports = router;
