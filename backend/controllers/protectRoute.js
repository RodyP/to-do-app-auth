const jwt = require("jsonwebtoken");
const User = require("../models/User");

const proteger = async (req, res, next) => {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      const validacion = jwt.verify(token, process.env.SECRET_PASSWORD);

      req.usuario = await User.findById(validacion.id).select("-password");

      if (!req.usuario)
        return res
          .status(401)
          .json({ mensaje: "Usuario eliminado o Token no valido" });
      next();
    }
  } catch (error) {
    console.log("Error: " + error.message);
  }

  if (!token) return res.status(400).json({ mensaje: "Token requerido" });
};

module.exports = proteger;
