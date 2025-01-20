const jwt = require("jsonwebtoken");
const { getDatabase } = require("../config/dbConnection");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Token is required" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.decoded = decoded;
    next();
  });
};


const usersCollection = getDatabase().collection("users");

// verifyAdmin middleware
const verifyAdmin = async (req, res, next) => {
  const email = req.decoded.email;
  const query = { email: email };
  const user = await usersCollection.findOne(query);
  if (user?.roleValue === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Unauthorized" });
  }
};
const verifyHR = async (req, res, next) => {
  const email = req.decoded.email;
  const query = { email: email };
  const user = await usersCollection.findOne(query);
  if (user?.roleValue === "HR") {
    next();
  } else {
    res.status(403).json({ message: "Unauthorized" });
  }
};
const verifyEmployee = async (req, res, next) => {
  const email = req.decoded.email;
  const query = { email: email };
  const user = await usersCollection.findOne(query);
  if (user?.roleValue === "Employee") {
    next();
  } else {
    res.status(403).json({ message: "Unauthorized" });
  }
};

const verifyAdminOrHR = async (req, res, next) => {
  try {
      const email = req.decoded.email;
      const usersCollection = getDatabase().collection('users');
      const user = await usersCollection.findOne({ email });
      if (user && (user.roleValue === 'admin' || user.roleValue === 'HR')) {
          next();
      } else {
          return res.status(403).json({ 
              message: "Access denied. Requires admin or HR privileges." 
          });
      }
  } catch (error) {
      return res.status(500).json({ 
          message: "Error verifying user role", 
          error: error.message 
      });
  }
};

module.exports = { verifyToken, verifyAdmin, verifyHR, verifyEmployee, verifyAdminOrHR };