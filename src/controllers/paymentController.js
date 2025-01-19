const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/dbConnection");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const paymentCollection = getDatabase().collection("payment");

const createPaymentIntent = async (req, res) => {
  try {
    const { salary } = req.body;
    const amount = parseInt(salary * 100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating payment intent", error: error.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const payment = req.body;
    // const existingPayment = await paymentCollection.findOne({
    //     employeeEmail,
    //     month,
    //     year
    // });

    // if (existingPayment) {
    //     return res.status(400).json({ 
    //         message: "Payment for this month and year already exists" 
    //     });
    // }
    const result = await paymentCollection.insertOne(payment);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ message: "Error creating payment", error });
  }
};

const getPayments = async (req, res) => {
  try {
    const email = req.params.email;
    if (email) {
      const query = { employeeEmail: email };
      const result = await paymentCollection.find(query).toArray();
      res.json(result);
    } else {
      const result = await paymentCollection.find().toArray();
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error });
  }
};

const updatePayment = async (req, res) => {
  try {
    const payment = req.body;
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await paymentCollection.updateOne(query, {
      $set: payment,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error updating payment", error });
  }
};

module.exports = { createPaymentIntent, createPayment, getPayments, updatePayment };
