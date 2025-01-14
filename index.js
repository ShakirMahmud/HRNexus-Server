const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectToDatabase } = require("./src/config/dbConnection");
const usersRoutes = require("./src/routes/usersRoutes");
const jwtCreateToken = require("./src/routes/jwtCreateToken");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection and server start
async function startServer() {
  try {
    await connectToDatabase();

    // Routes
    app.use("/jwt", jwtCreateToken);
    app.use("/users", usersRoutes);

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
