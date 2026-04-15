const path = require("path");
const User = require("../models/User");
const Tarea = require("../models/Tarea");
const token = require("jsonwebtoken");
const streamifier = require("streamifier");
const cloudinary = require("cloudinary").v2;
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

  let profilePictureUrl = "sin foto";
  let uploadedFilePublicId = null;

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
      return res.status(400).json({
        succes: false,
        mensaje: "Usuario ya registrado, intente con un email diferente",
      });
    }

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "perfiles",
            allowed_formats: ["jpg", "jpeg", "png"],
            public_id: "user_" + Date.now(), // Nombre único
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        // Enviamos el buffer (req.file.buffer) a Cloudinary
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });

      profilePictureUrl = uploadResult.secure_url;
      uploadedFilePublicId = uploadResult.public_id; // Ej: "perfiles/user_1775966131029"
    }

    console.log(profilePictureUrl);

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
    console.log("Error en register: " + err.message);

    // Si ocurrió un error DESPUÉS de haber subido la imagen, la eliminamos de Cloudinary
    if (uploadedFilePublicId) {
      try {
        await cloudinary.uploader.destroy(uploadedPublicId);
        console.log(
          `Imagen ${uploadedPublicId} eliminada de Cloudinary por error`,
        );
      } catch (cleanupError) {
        console.error("Error limpiando imagen de Cloudinary:", cleanupError);
      }
    }

    res.status(500).json({ mensaje: "Error interno del servidor" });
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
      cloudinary.uploader.destroy(
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
