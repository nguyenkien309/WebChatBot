const mongoose = require('mongoose');

const utterSchema = mongoose.Schema({
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
const utter = mongoose.model('utter', utterSchema);
module.exports = utter;