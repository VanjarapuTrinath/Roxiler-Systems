const express = require("express");
const pool = require("../config/db");
const { authenticateUser } = require("../middlewares/authMiddleware");



const router = express.Router();

// 📌 POST: Rate a Store
router.post("/rate-store", authenticateUser, async (req, res) => {
    const { storeId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!storeId || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Invalid rating. Must be between 1 and 5." });
    }

    try {
        await pool.query(
            "INSERT INTO store_ratings (user_id, store_id, rating, comment) VALUES (?, ?, ?, ?)",
            [userId, storeId, rating, comment]
        );

        res.status(201).json({ message: "Rating submitted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// 📌 GET: Fetch Store Ratings
router.get("/store-ratings/:storeId", async (req, res) => {
    const { storeId } = req.params;

    try {
        const [ratings] = await pool.query(
            "SELECT users.name, store_ratings.rating, store_ratings.comment FROM store_ratings JOIN users ON store_ratings.user_id = users.id WHERE store_ratings.store_id = ?",
            [storeId]
        );

        if (ratings.length === 0) {
            return res.status(404).json({ message: "No ratings found for this store." });
        }

        res.status(200).json({ ratings });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

module.exports = router;
