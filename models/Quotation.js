const mongoose = require("mongoose");

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