const mongoose = require('mongoose');

const dataIntentSchema = mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    intent_id: {
        type: mongoose.Types.ObjectId,
        ref : "intent",
        required: true,
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref : "user"
    },
}, {
    timestamps: true,
})
const dataIntent = mongoose.model('dataIntent', dataIntentSchema);
module.exports = dataIntent;