const {
  register,
  login,
  deleteAcount,
  perfil
  // profile,
} = require("../controllers/userController");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

const uploader = multer({ storage: storage });

router.post("/login", login);
router.post("/register", uploader.single("picture"), register);
router.delete("/deleteAcount/:id", deleteAcount);
// router.get("/profile/:id", perfil);
// router.get("/profile/:id", profile);

module.exports = router;
