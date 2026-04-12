const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Conectado a MongoDB");
  })
  .catch((err) => "Error: " + err.message);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/img", require("./routes/perfil"));
app.use("/api/tarea", require("./routes/tarea"));


app.listen(PORT, () => {
  console.log("Server running at http://localhost:" + PORT);
});
