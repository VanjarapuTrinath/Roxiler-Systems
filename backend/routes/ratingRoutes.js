const express = require("express");
const pool = require("../config/db"); // MySQL connection pool
const { authenticateUser } = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ POST: Add a rating (MySQL)
router.post("/rate", authenticateUser, async (req, res) => {
    try {
        const { storeId, rating, comment } = req.body;
        const userId = req.user.id;

        if (!storeId || !rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Invalid rating. Must be between 1 and 5." });
        }

        // Insert into MySQL database
        await pool.query(
            "INSERT INTO store_ratings (user_id, store_id, rating, comment) VALUES (?, ?, ?, ?)",
            [userId, storeId, rating, comment]
        );

        res.status(201).json({ message: "Rating submitted successfully!" });

    } catch (error) {
        console.error("Error submitting rating:", error);
        res.status(500).json({ message: "Server Error", error });
    }
});

// ✅ GET: Fetch ratings for a store (MySQL)
router.get("/:storeId", async (req, res) => {
    try {
        const { storeId } = req.params;

        const [ratings] = await pool.query(
            "SELECT users.name, store_ratings.rating, store_ratings.comment, store_ratings.created_at FROM store_ratings JOIN users ON store_ratings.user_id = users.id WHERE store_ratings.store_id = ?",
            [storeId]
        );

        if (ratings.length === 0) {
            return res.status(404).json({ message: "No ratings found for this store." });
        }

        res.status(200).json({ ratings });

    } catch (error) {
        console.error("Error fetching ratings:", error);
        res.status(500).json({ message: "Server Error", error });
    }
});

module.exports = router;
