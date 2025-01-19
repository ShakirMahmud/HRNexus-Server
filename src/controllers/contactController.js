const { getDatabase } = require("../config/dbConnection");

const contactCollection = getDatabase().collection("contact");

const getContact = async (req, res) => {
    try {
        const result = await contactCollection.find().toArray();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Error fetching contact", error });
    }
};

const postContact = async (req, res) => {
    try {
        const contact = req.body;
        const result = await contactCollection.insertOne(contact);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Error adding contact", error });
    }
};

module.exports = { getContact, postContact };