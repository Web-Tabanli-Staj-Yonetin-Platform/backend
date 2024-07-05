const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Intern = require("../models/intern");
const Match = require("../models/match");
const Advert = require("../models/advert");
const Application = require("../models/application");
const config = require("config");
const moment = require("moment");
const { authenticateUser } = require("../../middlewares/autenticateUser");

router.post("/", authenticateUser, async (req, res) => {
  try {
    const { advert } = req.body;
    const { user } = req;

    if (user.role !== "intern") {
      return res
        .status(403)
        .send({ response: false, error: "Yalnızca 'intern' kullanıcısı ilanları başvuru yapabilir." });
    }

    if (!advert) {
      return res
        .status(400)
        .send({ response: false, error: "İlan gerekli." });
    }

    const dbAdvert = await Advert.findById(advert);
    if (!dbAdvert) {
      return res
        .status(404)
        .send({ response: false, error: "İlan bulunamadı." });
    }
    const newApplication = new Application({
      intern: user.intern,
      advert,
      status: "pending",
      isScored: false,
    });

    await newApplication.save();

    res
      .status(201)
      .send({ response: true, message: "Başvuru başarıyla gönderildi." });
  } catch (error) {
    console.error("Başvuru yapılırken hata oluştu:", error);
    res.status(500).send({
      response: false,
      error: "Başvuru gönderilirken bir hata oluştu.",
    });
  }
});

router.get("/advert/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;
    if (user.role !== "company") {
      return res.status(403).send({
        response: false,
        error: "Başvuruları yalnızca 'company' kullanıcıları görebilir.",
      });
    }
    const advert = await Advert.findOne({ _id: id, company: user.company });
    if (!advert) {
      return res
        .status(404)
        .send({ response: false, error: "İlan bulunamadı." });
    }

    const applications = await Application.find({ advert: id })
      .populate("intern")
      .populate("advert");
    let applicationArray = [];
    for (let application of applications) {
      const match = await Match.findOne({
        $or: [
          { intern_id: application.intern._id },
          { intern_id: application.intern.user },
        ],
      });
      for (let m of match?.matches) {
        if (m.advert_id._id.toString() === advert._id.toString()) {
          applicationArray.push({
            ...application.toObject(),
            score: m.match_score,
          });
        }
      }
    }
    res.status(200).send({
      response: true,
      applications: applicationArray,
    });
  } catch (error) {
    console.error("Başvurular getirilirken hata oluştu:", error);
    res.status(500).send({
      response: false,
      error: "Başvurular alınırken bir hata oluştu.",
    });
  }
});

router.patch("/accept/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    if (user.role !== "company") {
      return res.status(403).send({
        response: false,
        error: "Başvuruları yalnızca şirketler kabul edebilir.",
      });
    }

    const application = await Application.findById(id).populate("advert");

    if (!application) {
      return res
        .status(404)
        .send({ response: false, error: "Başvuru bulunamadı." });
    }

    const advert = await Advert.findById(application.advert._id);

    if (advert.company?._id.toString() !== user.company.toString()) {
      return res.status(403).send({
        response: false,
        error: "Bu başvuruyu kabul etme yetkisi yok.",
      });
    }

    application.status = "accepted";

    await application.save();

    res.status(200).send({
      response: true,
      message: "Başvuru başarıyla kabul edildi.",
      application,
    });
  } catch (error) {
    console.error("Başvuru kabul edilirken hata oluştu:", error);
    res.status(500).send({
      response: false,
      error: "Başvuruyu kabul ederken bir hata oluştu.",
    });
  }
});

router.patch("/reject/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    if (user.role !== "company") {
      return res.status(403).send({
        response: false,
        error: "Başvuruları yalnızca şirketler kabul edebilir.",
      });
    }

    const application = await Application.findById(id).populate("advert");

    if (!application) {
      return res
        .status(404)
        .send({ response: false, error: "Başvuru bulunamadı." });
    }

    const advert = await Advert.findById(application.advert._id);

    if (advert.company._id.toString() !== user.company.toString()) {
      return res.status(403).send({
        response: false,
        error: "Bu başvuruyu kabul etme yetkisi yok.",
      });
    }

    application.status = "rejected";

    await application.save();

    res.status(200).send({
      response: true,
      message: "Başvuru başarıyla reddedildi.",
      application,
    });
  } catch (error) {
    console.error("Başvuru kabul edilirken hata oluştu:", error);
    res.status(500).send({
      response: false,
      error: "Başvuruyu kabul ederken bir hata oluştu.",
    });
  }
});

// Get own applications
router.get("/own", authenticateUser, async (req, res) => {
  try {
    const { user } = req;

    let applications;
    if (user.role === "intern") {
      applications = await Application.find({ intern: user.intern })
        .populate("intern")
        .populate("advert");
    } else if (user.role === "company") {
      const adverts = await Advert.find({ company: user.company }).select(
        "_id"
      );
      applications = await Application.find({
        advert: { $in: adverts.map((advert) => advert._id) },
      })
        .populate("intern")
        .populate("advert");
    } else {
      return res
        .status(403)
        .send({ response: false, error: "Yetkisiz erişim." });
    }

    res.status(200).send({ response: true, applications });
  } catch (error) {
    console.error("Kendi başvurularız getirilirken hata oluştu:", error);
    res.status(500).send({
      response: false,
      error: "Başvurularınız alınırken bir hata oluştu.",
    });
  }
});

// Edit application by ID
router.put("/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, score, isScored } = req.body;
    const { user } = req;

    if (user.role !== "company") {
      return res.status(403).send({
        response: false,
        error: "Başvuruları yalnızca şirketler düzenleyebilir.",
      });
    }

    const application = await Application.findById(id).populate("advert");

    if (!application) {
      return res
        .status(404)
        .send({ response: false, error: "Başvuru bulunamadı." });
    }

    const advert = await Advert.findById(application.advert._id);

    if (advert.company.toString() !== user._id.toString()) {
      return res.status(403).send({
        response: false,
        error: "Bu başvuruyu düzenleme yetkisi yok.",
      });
    }

    application.status = status || application.status;
    application.score = score !== undefined ? score : application.score;
    application.isScored =
      isScored !== undefined ? isScored : application.isScored;

    await application.save();

    res.status(200).send({
      response: true,
      message: "Başvuru başarılı bir şekilde güncellendi.",
      application,
    });
  } catch (error) {
    console.error("Başvuru güncellenirken bir hata oluştu:", error);
    res.status(500).send({
      response: false,
      error: "Başvuru güncellenirken bir hata oluştu.",
    });
  }
});

module.exports = router;
