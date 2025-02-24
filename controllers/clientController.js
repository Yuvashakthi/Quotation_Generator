const ClientModel = require('../models/Client');

exports.getClientByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const client = await ClientModel.findOne({ email });

        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        res.json({ success: true, data: client });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
