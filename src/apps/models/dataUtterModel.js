const mongoose = require('mongoose');

const dataUtterSchema = mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    utter_id: {
        type: mongoose.Types.ObjectId,
        ref : "utter"
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref : "user"
    },
}, {
    timestamps: true,
})
const dataUtter = mongoose.model('dataUtter', dataUtterSchema);
module.exports = dataUtter;