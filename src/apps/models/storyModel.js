const mongoose = require('mongoose');

const storySchema = mongoose.Schema({
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
    intent_id: {
        type: mongoose.Types.ObjectId,
        ref: "intent"
    },
    utter_id: {
        type: mongoose.Types.ObjectId,
        ref: "utter"
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
}, {
    timestamps: true,
})
const story = mongoose.model('story', storySchema);
module.exports = story;