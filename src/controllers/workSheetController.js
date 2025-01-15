const { getDatabase } = require('../config/dbConnection');
const workSheetCollection = getDatabase().collection('workSheet');

const postWorkSheet = async (req, res) => {
    try {
        const workSheet = req.body;
        console.log(workSheet);
        // send error message if not employee
        const email = workSheet.email;
        console.log(email);
        // if(email !== req.decoded.email) {
        //     return res.status(403).json({ message: "Unauthorized" });
        // }
        // const result = await workSheetCollection.insertOne(workSheet);
        // res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Error adding workSheet", error });
    }
};

const getWorkSheet = async (req, res) => {
    try {
        const result = await workSheetCollection.find().toArray();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Error fetching workSheet", error });
    }
};

module.exports = { postWorkSheet, getWorkSheet };