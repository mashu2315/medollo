const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const userMedicineRoutes = require("./routes/userMedicine.routes");
const vendorRoutes = require("./routes/vendor.routes.js");

const { connectDB } = require("./config/db");

// Import the correct Brand model and new search routes
const Brands = require("./models/Brand");
const searchRoutes = require("./routes/search");
const randomMedicines = require("./routes/randomMedicine");
// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/user-medicines", userMedicineRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/random", randomMedicines);
app.use("/api/vendors", vendorRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "Server is running" });
});
// get all brands
app.get("/brands", async (req, res) => {
  try {
    const brands = await Brands.find();
    res.json(brands);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching brands");
  }
});

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
