const Tarea = require("../models/Tarea");

const obtenerTareas = async (req, res) => {
  const { _id } = req.usuario;
  try {
    const tareas = await Tarea.find({ usuario: _id });
    res.status(200).json(tareas);
  } catch (error) {
    console.log("Error al obtener tareas: " + error.message);
  }
};

const crearTarea = async (req, res) => {
  const tarea = new Tarea({
    titulo: req.body.titulo,
    usuario: req.usuario._id,
  });

  try {
    const nuevaTarea = await tarea.save();
    res.status(200).json(nuevaTarea);
  } catch (error) {
    console.log("Error al crear tarea: " + error.message);
  }
};

const actualizarTarea = async (req, res) => {
  try {
    const updatedTarea = await Tarea.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after" },
    );
    res.status(200).json(updatedTarea);
  } catch (error) {
    console.log("Error al actualizar tarea: " + error.message);
  }
};

const eliminarTarea = async (req, res) => {
  try {
    await Tarea.findByIdAndDelete(req.params.id);
    res.status(200).json("Tarea eliminada");
  } catch (error) {
    console.log("Error al eliminar la tarea: " + error.message);
  }
};

module.exports = { obtenerTareas, crearTarea, actualizarTarea, eliminarTarea };
