const express = require("express");
const router = express.Router();
const proteger = require('../controllers/protectRoute')
const {
  obtenerTareas,
  crearTarea,
  actualizarTarea,
  eliminarTarea,
} = require("../controllers/tareaControllers");

router.use(proteger)

router.get("/", obtenerTareas);
router.post("/", crearTarea);
router.put("/:id", actualizarTarea);
router.delete("/:id", eliminarTarea);

module.exports = router;
