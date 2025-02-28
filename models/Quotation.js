const mongoose = require("mongoose");

// Define Mongoose Schema
const quotationSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    businessName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    quotationId: { type: String, required: true, unique: true }, // Ensuring uniqueness
    date: { type: String, required: true },
    clientId: { type: String, default: () => new mongoose.Types.ObjectId().toString() }, // Generate if not provided
    subtotal: { type: Number, required: true },
    discount: { type: Number, required: true },
    tax: { type: Number, required: true },
    finalTotal: { type: Number, required: true },
    items: [
        {
            service: { type: String, required: true },
            serviceId: { type: String, required: true },
            quantity: { type: Number, required: true },
            unitPrice: { type: Number, required: true },
            totalPrice: { type: Number, required: true },
        },
    ],
});

const Quotation = mongoose.model("Quotation", quotationSchema);
