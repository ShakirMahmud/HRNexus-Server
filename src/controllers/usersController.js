const { getDatabase } = require('../config/dbConnection');
const usersCollection = getDatabase().collection('users');


const getUsers = async (req, res) => {
  try {
    const result = await usersCollection.find().toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

const addUser = async (req, res) => {
    try {
        const user = req.body;
        const existingUser = await usersCollection.findOne({ email: user.email });
        if (existingUser) {
          return res.json({ message: "User already exists" });
        }
        const result = await usersCollection.insertOne(user);
        res.json(result);
      } catch (error) {
        res.status(500).json({ message: "Error adding user", error });
      }
};

const checkUserByEmail = async (req, res) => {
    try {
      const { email } = req.query;
      const user = await usersCollection.findOne({ email });
      
      if (user) {
        res.json({
          exists: true,
          roleValue: user.roleValue || null
        });
      } else {
        res.json({
          exists: false,
          roleValue: null
        });
      }
    } catch (error) {
      res.status(500).json({ 
        message: "Error checking user", 
        error,
        exists: false,
        roleValue: null 
      });
    }
  };

  const getAdmins = async (req, res) => {
    try {
      const email = req.params.email;
    //   if (email !== req.decoded.email) {
    //     return res.status(403).json({ message: "Unauthorized" });
    //   }
      const query = { email: email };
      const result = await usersCollection.findOne(query);
      let isAdmin = false;
      if (result?.roleValue === "admin") {
        isAdmin = true;
      }
      res.json({ isAdmin });
    } catch (error) {
      res.status(500).json({ message: "Error fetching admins", error });
    }
  };
  const getHRs = async (req, res) => {
    try {
      const email = req.params.email;
    //   if (email !== req.decoded.email) {
    //     return res.status(403).json({ message: "Unauthorized" });
    //   }
      const query = { email: email };
      const result = await usersCollection.findOne(query);
      let isHR = false;
      if (result?.roleValue === "HR") {
        isHR = true;
      }
      res.json({ isHR });
    } catch (error) {
      res.status(500).json({ message: "Error fetching admins", error });
    }
  };

module.exports = { getUsers, addUser, checkUserByEmail, getAdmins, getHRs };