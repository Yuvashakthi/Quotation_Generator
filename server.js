// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public"))); // Serve static files from 'public' folder

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI,)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Mongoose Schema
const quotationSchema = new mongoose.Schema({
  businessName: String,
  email: String,
  Name: String,
  phone: String,
  address: String,
  quotationId: String,
  date: String,
  clientId: String,
  items: [
    {
      service: String,
      serviceId: String,
      quantity: Number,
      unitPrice: Number,
      totalPrice: Number,
    },
  ],
});

const Quotation = mongoose.model("Quotation", quotationSchema);

// Ensure `Quotation` is defined before using it in routes

// Save a new quotation
app.post("/api/quotations", async (req, res) => {
  try {
    let { Name, businessName, email, phone, address, quotationId, date, clientId, items } = req.body;

    if (!Name || !businessName || !email || !phone || !address || !quotationId || !date || items.length === 0) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    // If clientId is not provided, generate a new one
    if (!clientId) {
      clientId = new mongoose.Types.ObjectId().toString(); // Generates a unique client ID
    }

    const newQuotation = new Quotation({
      Name,
      businessName,
      email,
      phone,
      address,
      quotationId,
      date,
      clientId, // Store the generated or provided clientId
      items,
    });

    await newQuotation.save();
    res.status(201).json({ message: "Quotation saved successfully!", clientId });
  } catch (error) {
    console.error("Error saving quotation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get quotations by email
app.get("/api/quotations/:email", async (req, res) => {
  try {
    const quotations = await Quotation.find({ email: req.params.email });

    if (!quotations || quotations.length === 0) {
      return res.status(404).json({ error: "Quotation not found. Please enter all details." });
    }

    res.status(200).json(quotations);
  } catch (error) {
    console.error("Error fetching quotations:", error);
    res.status(500).json({ error: "Failed to fetch quotations" });
  }
});

// Get client details by email
app.get("/api/clients", async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const client = await Quotation.findOne({ email: email });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(client);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get the latest quotation ID
app.get("/api/latest-quotation", async (req, res) => {
  try {
    const latestQuotation = await Quotation.findOne().sort({ quotationId: -1 });

    if (latestQuotation) {
      res.json({ latestQuotationId: latestQuotation.quotationId });
    } else {
      res.json({ latestQuotationId: null });
    }
  } catch (error) {
    console.error("Error fetching latest quotation:", error);
    res.status(500).json({ error: "Failed to fetch latest quotation" });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
