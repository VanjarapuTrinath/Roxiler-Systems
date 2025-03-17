const express = require("express");
const pool = require("../config/db");
const { authenticateUser, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

// Admin: Create a New Store
router.post("/create", authenticateUser, authorizeRoles("Admin"), async (req, res) => {
    const { name, email, address } = req.body;

    try {
        await pool.query(
            "INSERT INTO stores (name, email, address, rating) VALUES (?, ?, ?, ?)",
            [name, email, address, 0]
        );
        res.status(201).json({ message: "Store created successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error creating store", error: error.message });
    }
});

// Normal User: View All Stores
router.get("/all", authenticateUser, async (req, res) => {
    try {
        const [stores] = await pool.query("SELECT * FROM stores");
        res.json(stores);
    } catch (error) {
        res.status(500).json({ message: "Error fetching stores", error: error.message });
    }
});

// Normal User: Rate a Store
router.post("/rate", authenticateUser, async (req, res) => {
    const { storeId, rating } = req.body;

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }

    try {
        await pool.query(
            "INSERT INTO ratings (store_id, user_id, rating) VALUES (?, ?, ?)",
            [storeId, req.user.id, rating]
        );

        res.status(201).json({ message: "Rating submitted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error submitting rating", error: error.message });
    }

    router.get("/all", authenticateUser, async (req, res) => {
        let { page, limit } = req.query;
        page = page ? parseInt(page) : 1;
        limit = limit ? parseInt(limit) : 10;
        const offset = (page - 1) * limit;
    
        try {
            const [stores] = await pool.query("SELECT * FROM stores LIMIT ? OFFSET ?", [limit, offset]);
            res.json({ page, limit, stores });
        } catch (error) {
            res.status(500).json({ message: "Error fetching stores", error: error.message });
        }
    });
    
});

module.exports = router;
