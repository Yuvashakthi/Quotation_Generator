const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    Name: { type: String, required: true},
    businessName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
});



module.exports = mongoose.model("Client", clientSchema);
