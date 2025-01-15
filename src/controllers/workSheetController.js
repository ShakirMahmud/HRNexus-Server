const { getDatabase } = require('../config/dbConnection');
const workSheetCollection = getDatabase().collection('workSheet');
const { verifyToken, verifyHR, verifyEmployee } = require('../middleware/authMiddleware');

const postWorkSheet = async (req, res) => {
    try {
        const workSheet = req.body;
        console.log(workSheet);
        // send error message if not employee
        const email = workSheet.email;
        console.log(email);
        if(email !== req.decoded.email) {
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
        if(email){
            await verifyToken(req, res, async () => {
                await verifyEmployee(req, res, async () => {
                    if(email !== req.decoded.email) {
                        return res.status(403).json({ message: "Unauthorized" });
                    }
                    const query = { email: email };
                    const result = await workSheetCollection.findOne(query);
                    res.json(result);
                })
            })
        }else{
            await verifyToken(req, res, async () => {
                await verifyHR(req, res, async () => {
                    const result = await workSheetCollection.find().toArray();
                    res.json(result);
                })
            })
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching workSheet", error });
    }
};

module.exports = { postWorkSheet, getWorkSheet };