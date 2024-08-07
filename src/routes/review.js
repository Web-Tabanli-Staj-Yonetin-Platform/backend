const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Intern = require("../models/intern");
const Company = require("../models/company");
const Advert = require("../models/advert");
const Review = require("../models/review");
const config = require("config");
const moment = require("moment");
const { authenticateUser } = require("../../middlewares/autenticateUser");

router.post("/", authenticateUser, async (req, res) => {
  try {
    let { company, intern, score, comment, advert } = req.body;
    const { user } = req;
    if (!user) {
      return res.status(401).json({ response: false, message: "Yetkisizsiniz" });
    }
    if (user.role === "company" && !intern) {
      return res.status(400).json({ response: false, message: "Stajyer sağlanmalı" });
    }
    if (user.role === "intern" && !company && !advert) {
      return res.status(400).json({
        response: false,
        message: "Şirket veya ilan sağlanmalı",
      });
    }
    if (!score) {
      return res.status(400).json({ response: false, message: "Puan verilmeli" });
    }
    if (!comment) {
      return res.status(400).json({ response: false, message: "Yorum sağlanmalı" });
    }
    if (score < 1 || score > 5) {
      return res.status(400).json({ response: false, message: "Puan 1 ile 5 arasında olmalıdır" });
    }
    let reviewer = user.role;
    if (user.role === "company") {
      company = user.company;
    }
    if (user.role === "intern") {
      intern = user.intern;
    }
    if (advert) {
      const dbAdvert = await Advert.findById(advert);
      if (!dbAdvert) {
        return res.status(404).send({ response: false, error: "İlan bulunamadı." });
      }
    }
    if (company) {
      const dbCompany = await Company.findById(company);
      if (!dbCompany) {
        return res.status(404).send({ response: false, error: "Şirket bulunamadı." });
      }
    }
    if (intern) {
      const dbIntern = await Intern.findById(intern);
      if (!dbIntern) {
        return res.status(404).send({ response: false, error: "Stajyer bulunamadı." });
      }
    }

    if (await Review.exists({ company, intern, reviewer, advert })) {
      return res.status(400).json({
        response: false,
        message: `Bunu zaten incelediniz`,
      });
    }
    const review = new Review({
      company,
      intern,
      reviewer,
      score,
      comment,
      advert,
    });

    await review.save();
    res.status(201).json({ response: true, message: "İnceleme başarıyla oluşturuldu", review });
  } catch (error) {
    res.status(500).json({ response: false, error: error.message });
  }
});

router.get("/companies/:companyId", authenticateUser, async (req, res) => {
  try {
    const { companyId } = req.params;

    const reviews = await Review.find({ company: companyId }).populate("company").populate("intern");
    const averageScore = reviews.reduce((acc, review) => acc + review.score, 0) / reviews.length || 0;

    res.status(200).json({ reviews, averageScore });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/adverts/:advertId", authenticateUser, async (req, res) => {
  try {
    const { advertId } = req.params;

    const reviews = await Review.find({ advert: advertId }).populate("company").populate("intern");
    const averageScore = reviews.reduce((acc, review) => acc + review.score, 0) / reviews.length || 0;

    res.status(200).json({ reviews, averageScore });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/adverts/", authenticateUser, async (req, res) => {
  try {
    const { user } = req;

    let adverts;
    if (user.role === "company") {
      adverts = await Advert.find({ company: user.company }).select("_id");
    } else if (user.role === "intern") {
      const reviews = await Review.find({ intern: user.intern }).select("advert");
      adverts = reviews.map((review) => review.advert);
    }

    const reviews = await Review.find({ advert: { $in: adverts.map((advert) => advert._id) } })
      .populate("company")
      .populate("intern");
    const averageScore = reviews.reduce((acc, review) => acc + review.score, 0) / reviews.length || 0;

    res.status(200).json({ reviews, averageScore });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
