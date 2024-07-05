const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Intern = require("../models/intern");
const Company = require("../models/company");
const Advert = require("../models/advert");
const config = require("config");
const moment = require("moment");
const { authenticateUser } = require("../../middlewares/autenticateUser");

router.post("/create", authenticateUser, async (req, res) => {
  try {
    const { title, field, requirements, foreignLanguages, department } =
      req.body;

    const { user } = req;
    if (user.role !== "company") {
      return res
        .status(403)
        .send({ response: false, error: "Yanlızca 'company' kullanıcısı ilanları oluşturabilir." });
    }
    console.log(user);
    const advert = await Advert.findOne({ title });
    if (advert) {
      return res
        .status(400)
        .send({ response: false, error: "Bu ilan zaten mevcut." });
    }
    // Basic validation
    if (!title || !field || !requirements || !foreignLanguages || !department) {
      return res.status(400).send({
        response: false,
        error:
          "Tüm alanlar zorunludur: şirket, unvan, alan, gereksinimler, yabancı diller ve departman.",
      });
    }

    // Create new advert
    const newAdvert = new Advert({
      company: user.company,
      title,
      field,
      requirements,
      foreignLanguages,
      department,
    });

    await newAdvert.save();

    res
      .status(201)
      .send({ response: true, message: "İlan başarıyla eklendi." });
  } catch (error) {
    console.error("İlan eklenirken hata oluştu:", error);
    res.status(500).send({
      response: false,
      error: "İlan eklenirken bir hata oluştu.",
    });
  }
});

router.get("/", authenticateUser, async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res
        .status(403)
        .send({ response: false, error: "Yetkisizsiniz." });
    }
    const adverts = await Advert.find();
    res.status(200).send({ response: true, adverts });
  } catch (error) {
    console.error("İlanlar getirilirken hata oluştu:", error);
    res.status(500).send({
      response: false,
      error: "İlanlar alınırken bir hata oluştu.",
    });
  }
});

// Get own adverts
router.get("/own", authenticateUser, async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res
        .status(403)
        .send({ response: false, error: "Yetkisizsiniz." });
    }
    if (user.role !== "company") {
      return res.status(403).send({
        response: false,
        error: "Yalnızca companies kendi ilanları alabilir.",
      });
    }
    const adverts = await Advert.find({ company: user.company });
    res.status(200).send({ response: true, adverts });
  } catch (error) {
    console.error("Kendi ilanınız alınırken hata oluştu:", error);
    res.status(500).send({
      response: false,
      error: "İlanlarınız alınırken bir hata oluştu.",
    });
  }
});

router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res
        .status(403)
        .send({ response: false, error: "Yetkisizsiniz." });
    }
    const advert = await Advert.findOne({ _id: req.params.id });
    res.status(200).send({ response: true, advert });
  } catch (error) {
    console.error("Kendi ilanınız alınırken hata oluştu:", error);
    res.status(500).send({
      response: false,
      error: "İlanlarınız alınırken bir hata oluştu.",
    });
  }
});

// Edit advert by ID
router.put("/:id", authenticateUser, async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res
        .status(403)
        .send({ response: false, error: "Yetkisizsiniz." });
    }
    if (user.role !== "company") {
      return res.status(403).send({
        response: false,
        error: "Yalnızca companies kendi ilanları alabilir.",
      });
    }
    const advert = await Advert.findById(req.params.id);
    if (!advert) {
      return res
        .status(404)
        .send({ response: false, error: "İlan bulunamadı." });
    }
    const { id } = req.params;
    const {
      title,
      field,
      requirements,
      foreignLanguages,
      department,
    } = req.body;

    // Basic validation
    if (
      !title ||
      !field ||
      !requirements ||
      !foreignLanguages ||
      !department
    ) {
      return res.status(400).send({
        response: false,
        error:
          "Tüm alanlar zorunludur: başlık, alan, gereksinimler, yabancı diller ve bölüm.",
      });
    }

    const updatedAdvert = await Advert.findByIdAndUpdate(
      id,
      { title, field, requirements, foreignLanguages, department },
      { new: true, runValidators: true }
    );

    if (!updatedAdvert) {
      return res
        .status(404)
        .send({ response: false, error: "İlan bulunamadı." });
    }

    res.status(200).send({
      response: true,
      message: "İlan başarıyla güncellendi.",
      advert: updatedAdvert,
    });
  } catch (error) {
    console.error("İlan güncellenirken hata oluştu:", error);
    res.status(500).send({
      response: false,
      error: "İlan güncellenirken bir hata oluştu.",
    });
  }
});

module.exports = router;
