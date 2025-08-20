const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv")

const authRoutes = require("./routes/auth.js");
const uploadRoutes = require("./routes/upload.js");
const ratingRoutes = require("./routes/rating.js");

dotenv.config()

const app = express();
app.use(cors({origin: "*" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/rating", ratingRoutes);


app.listen(5000, () => console.log("Server running on http://localhost:5000"));



