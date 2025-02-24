// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
const bodyParser = require("body-parser");
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public"))); // Serve static files from 'public' folder

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Define Mongoose Schema
const quotationSchema = new mongoose.Schema({
    businessName: String,
    email: String,
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

// API Routes

// Save a new quotation
app.post("/api/quotations", async (req, res) => {
    try {
        let { businessName, email, phone, address, quotationId, date, clientId, items } = req.body;

        if (!businessName || !email || !phone || !address || !quotationId || !date || items.length === 0) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        // If clientId is not provided, generate a new one
        if (!clientId) {
            clientId = new mongoose.Types.ObjectId().toString(); // Generates a unique client ID
        }

        const newQuotation = new Quotation({
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

app.get('/api/clients', async (req, res) => {
    try {
        const email = req.query.email;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Use the correct model name (Quotation instead of Client)
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
