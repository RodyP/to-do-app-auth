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
const {CloudinaryStorage} = require("multer-storage-cloudinary");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const ext = path.extname(file.originalname);
//     cb(null, uniqueSuffix + ext);
//   },
// });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "perfiles",
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: (req, file) => "user_" + Date.now(),
  },
});

const uploader = multer({ storage: storage });

router.post("/login", login);
router.post("/register", uploader.single("picture"), register);
router.delete("/deleteAcount/:id", deleteAcount);
// router.get("/profile/:id", perfil);
// router.get("/profile/:id", profile);

module.exports = router;
