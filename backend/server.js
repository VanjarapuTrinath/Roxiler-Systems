const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // ✅ Ensures JSON parsing before routes

// Import Routes
const authRoutes = require("./routes/authRoutes");
const storeRoutes = require("./routes/storeRoutes");
const ratingRoutes = require("./routes/ratingRoutes"); // ✅ Add this

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/ratings", ratingRoutes); // ✅ Register rating routes

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
