const jwt = require("jsonwebtoken");

// Middleware to verify token
const authenticateUser = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
        return res.status(401).json({ message: "Access Denied! No Token Provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer"

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)
        req.user = decoded;
        next(); // Proceed to the next middleware or route
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Session Expired! Please log in again." });
        }
        console.log(error.message)
        return res.status(401).json({ message: "Invalid Token!" });
    }
};

// Middleware to check user roles
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access Forbidden: You don't have permission!" });
        }
        next();
    };
};

module.exports = { authenticateUser, authorizeRoles };
