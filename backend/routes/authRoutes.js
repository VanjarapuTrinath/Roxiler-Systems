const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { body, validationResult } = require("express-validator");

const router = express.Router();

// User Registration (Signup) with Validation
router.post("/signup", [
    body("name").isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    body("role").isIn(["Admin", "Normal User", "Store Owner"]).withMessage("Invalid role")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, address, role } = req.body;

    // Check if the user already exists
    const [existingUser] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
        return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    await pool.query(
        "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
        [name, email, hashedPassword, address, role]
    );

    res.status(201).json({ message: "User registered successfully!" });
});

// 🚀 ADD THIS LOGIN ROUTE 🚀
router.post("/login", [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Check if user exists
        const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const user = users[0];

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, "your_secret_key", { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
