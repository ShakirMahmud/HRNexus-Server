const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectToDatabase } = require("./src/config/dbConnection");
const usersRoutes = require("./src/routes/usersRoutes");
const jwtCreateToken = require("./src/utils/jwtCreateToken");
const workSheetRoutes = require("./src/routes/workSheetRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const contactRoutes = require("./src/routes/contactRoutes");
const statsRoutes = require("./src/routes/statsRoutes");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://hr-nexus-shakir.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true, 
  })
);
app.use(express.json());

// Database connection and server start
async function startServer() {
  try {
    await connectToDatabase();

    // Routes
    app.use("/jwt", jwtCreateToken);
    app.use("/users", usersRoutes);
    app.use("/workSheet", workSheetRoutes);
    app.use("/payments", paymentRoutes);
    app.use("/contact", contactRoutes);
    app.use("/stats", statsRoutes);

    // Basic route
    app.get("/", (req, res) => {
      res.send("HR Nexus Server is running!");
    });

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
  }
}

startServer();
