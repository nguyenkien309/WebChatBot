const mongoose = require('mongoose');

const intentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    user_id :{
        type: mongoose.Types.ObjectId,
        ref: 'user',
    }
}, {
    timestamps: true,
})
const intent = mongoose.model('intent', intentSchema);
module.exports = intent;