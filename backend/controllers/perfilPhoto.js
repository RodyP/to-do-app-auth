const User = require("../models/User");
const cloudinary = require("cloudinary");

const getProfilePicture = async (req, res) => {
  try {
    const userId = req.params.id;
    if (userId !== req.usuario.id) {
      return res.status(401).json({ mensaje: "no autorizado" });
    }

    const user = await User.findById(userId);
    if (!user || !user.perfilRuta) {
      return res.status(404).json({ mensaje: "Foto no encontrada" });
    }

    if(user.perfilRuta == "sin foto"){
      return res.json({url:process.env.IMAGE_DEFAULT});
    }

    const url = user.perfilRuta.split("/");
    const publicId = `${url[7]}/${url[8].split(".")[0]}`;

    const expiresAt = Math.floor(Date.now() / 1000) + 3600;

    const signedUrl = cloudinary.utils.url(publicId, {
      sign_url: true,
      expires_at: expiresAt,
    });

    res.json({ url: signedUrl });
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = getProfilePicture