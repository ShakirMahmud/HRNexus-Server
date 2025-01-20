const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/dbConnection");
const workSheetCollection = getDatabase().collection("workSheet");
const usersCollection = getDatabase().collection("users");
const {
  verifyToken,
  verifyHR,
  verifyEmployee,
} = require("../middleware/authMiddleware");

const postWorkSheet = async (req, res) => {
  try {
    const workSheet = req.body;
    const email = workSheet.email;
    if (email !== req.decoded.email) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const result = await workSheetCollection.insertOne(workSheet);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error adding workSheet", error });
  }
};

const getWorkSheet = async (req, res) => {
  try {
    const email = req.params.email;

    if (email) {
      await verifyToken(req, res, async () => {
        await verifyEmployee(req, res, async () => {
          if (email !== req.decoded.email) {
            return res.status(403).json({ message: "Unauthorized" });
          }
          const query = { email: email };
          const result = await workSheetCollection
            .find(query)
            .sort({ date: -1 })
            .toArray();
          res.json(result);
        });
      });
    } else {
      await verifyToken(req, res, async () => {
        await verifyHR(req, res, async () => {
          const result = await workSheetCollection
            .find()
            .sort({ date: -1 })
            .toArray();
          res.json(result);
        });
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching workSheet", error });
  }
};

const getTotalSalary = async (req, res) => {
    try {
        const worksheetResults = await workSheetCollection.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "email",
                    foreignField: "email",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $addFields: {
                    calculatedSalary: {
                        $multiply: ["$hours", "$user.salaryPerHour"],
                    },
                },
            },
            {
                $group: {
                    _id: "$email",
                    totalSalary: { $sum: "$calculatedSalary" },
                    totalHours: { $sum: "$hours" },
                },
            },
        ]).toArray();

        const hrUsers = await usersCollection.find({ roleValue: "HR" }).toArray();
        const hrSalaries = hrUsers.map((hr) => ({
            _id: hr.email,
            totalSalary: hr.salaryPerHour, 
            totalHours: 0,
        }));
        const combinedResults = [...worksheetResults, ...hrSalaries];

        res.json(combinedResults);
    } catch (error) {
        console.error("Error in getTotalSalary:", error);
        res.status(500).json({ message: "Error calculating total salary", error });
    }
};


const getWorkSheetById = async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await workSheetCollection.findOne(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching workSheet by id", error });
  }
};

const updateWorkSheet = async (req, res) => {
  try {
    const id = req.params.id;
    const workSheet = req.body;
    const query = { _id: new ObjectId(id) };
    const result = await workSheetCollection.updateOne(query, {
      $set: workSheet,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error updating workSheet", error });
  }
};

const deleteWorkSheet = async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await workSheetCollection.deleteOne(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error deleting workSheet", error });
  }
};

module.exports = {
  postWorkSheet,
  getWorkSheet,
  getWorkSheetById,
  updateWorkSheet,
  deleteWorkSheet,
  getTotalSalary,
};
