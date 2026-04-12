const path = require("path");
const User = require("../models/User");
const Tarea = require("../models/Tarea");
const token = require("jsonwebtoken");
const cloudinary = require("cloudinary");
// const jwt = require("jsonwebtoken");
// const fs = require("fs");

const generarToken = (id) => {
  return token.sign({ id }, process.env.SECRET_PASSWORD, {
    expiresIn: "7d",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no registrado" });
    }

    const validacion = await user.comparePassword(password);

    if (!validacion) {
      return res.status(400).json({ mensaje: "Credenciales incorrectas" });
    }

    res.status(200).json({
      usuario: {
        id: user._id,
        email: user.email,
        perfil: user.perfilRuta,
      },
      token: generarToken(user._id),
    });
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};

const register = async (req, res) => {
  const { email, password } = req.body;
  const profilePictureUrl = req.file ? req.file.path : "sin foto";
  const uploadedFilePublicId = req.file?.filename;

  try {
    if (!email && !password)
      return res.status(400).json({ mensaje: "Faltan campos por llenar" });

    if (password.length < 3) {
      return res
        .status(400)
        .json({ mensaje: "La contraseña debe tener más de dos caractéres" });
    }

    const user = await User.findOne({ email });
    if (user) {
      if (req.file) {
        cloudinary.v2.uploader.destroy(uploadedFilePublicId);
        // fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        succes: false,
        mensaje: "Usuario ya registrado, intente con un email diferente",
      });
    }

    const nuevo = new User({
      email,
      password,
      perfilRuta: profilePictureUrl,
    });

    await nuevo.save();

    res.status(200).json({
      succes: true,
      usuario: {
        id: nuevo._id,
        email: nuevo.email,
        perfil: nuevo.perfilRuta,
      },
      token: generarToken(nuevo._id),
    });
  } catch (err) {
    console.log("Error aqui es: " + err.message);
    if (req.file) {
      cloudinary.v2.uploader.destroy(uploadedFilePublicId);
    }
  }
};

const deleteAcount = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    await Tarea.deleteMany({ usuario: req.params.id });
    if (!user)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    // if (user.perfilRuta !== "sin foto") fs.unlinkSync(user.perfilRuta);
    if (user.perfilRuta !== "sin foto") {
      const urlPerfil = user.perfilRuta;
      const uploadedFilePublicId = urlPerfil.split("/");
      cloudinary.v2.uploader.destroy(
        `${uploadedFilePublicId[7]}/${uploadedFilePublicId[8].split(".")[0]}`,
      );
    }
    await user.deleteOne();
    res.status(200).json({ mensaje: "Usuario eliminado" });
  } catch (err) {
    console.log(err.message);
  }
};

const perfil = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const urlPerfil = user.perfilRuta;
    const imagen = await fetch(urlPerfil.toString());
    res.sendFile(imagen);
  } catch (err) {
    console.log(err.message);
  }
};

// const profile = async (req, res) => {
//   const decoded = jwt.verify(req.params.id, process.env.SECRET_PASSWORD);

//   const user = await User.findById(decoded.id);

//   if (!user) {
//     return res.status(404).json({ mensaje: "Usuario eliminado" });
//   }

//   if (user.perfilRuta == "sin foto")
//     return res.sendFile(
//       path.join(process.cwd(), "uploads", "blank-profile-picture.webp"),
//     );

//   const image = path.join(process.cwd(), user.perfilRuta);

//   res.sendFile(image);
// };

// module.exports = { register, login, deleteAcount, profile };
module.exports = { register, login, deleteAcount, perfil };
