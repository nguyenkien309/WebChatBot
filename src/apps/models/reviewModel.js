const mongoose = require('mongoose');
const reviewSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    avatar: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: ''
    },
    phone_number: {
        type: String,
        required: true,
        minlength: 6,
    },
    star:{
        type: Number,
        min: 0,
        max: 5,
        default: 5
    },
    is_hidded:{
        type: Boolean,
        default: "true"
    }
}, {
    timestamps: true,
})
const review = mongoose.model('review', reviewSchema);
module.exports = review;