const express = require("express");
const Client = require("../models/Client");
const Quotation = require("../models/Quotation");
const ClientController = require('../controllers/clientController');

const router = express.Router();

//  Fetch Client Data if Exists
router.get("/:email", async (req, res) => {
    try {
        const client = await Client.findOne({ email: req.params.email });
        if (client) {
            return res.status(200).json(client);
        }
        res.status(404).json({ message: "Client not found" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//  Save Client Data
router.post("/", async (req, res) => {
    try {
        const { Name,businessName, email, phone, address } = req.body;
        let client = await Client.findOne({ email });

        if (client) {
            return res.status(400).json({ message: "Client already exists" });
        }

        client = new Client({ Name, businessName, email, phone, address });
        await client.save();
        res.status(201).json(client);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//  Fetch Client Using Controller (if needed)
router.get('/:email', ClientController.getClientByEmail);

//  Create a Quotation
router.post("/quotations", async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Log the request body
        const { Name, businessName, email, phone, address, quotationId, date, items } = req.body;

        // Ensure `items` is an array before saving
        if (!Array.isArray(items)) {
            return res.status(400).json({ error: "Items must be an array" });
        }

        const newQuotation = new Quotation({
            Name,
            businessName,
            email,
            phone,
            address,
            quotationId,
            date,
            items
        });

        await newQuotation.save();
        res.status(201).json({ message: "Quotation created successfully", data: newQuotation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//  Handle Client Submission (Check or Create)
router.post("/submit", async (req, res) => {
    try {
        const { Name, businessName, email, phone, address } = req.body;

        // Check if client exists
        let client = await Client.findOne({ email });

        if (client) {
            // If client exists, return existing data
            return res.status(200).json({ message: "Client found", data: client });
        }

        // If client does not exist, create a new entry
        client = new Client({  Name,businessName, email, phone, address });
        await client.save();

        res.status(201).json({ message: "Client created successfully", data: client });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  Fetch Client Data by Email (if needed separately)
router.get("/:email", async (req, res) => {
    try {
        const client = await Client.findOne({ email: req.params.email });

        if (client) {
            return res.status(200).json(client);
        }
        res.status(404).json({ message: "Client not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
