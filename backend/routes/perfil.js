const express = require("express");
const proteger = require("../controllers/protectRoute");
const router = express.Router();
const getProfilePicture = require("../controllers/perfilPhoto");

router.use(proteger);

router.get("/perfil/:id", getProfilePicture);

module.exports = router;
