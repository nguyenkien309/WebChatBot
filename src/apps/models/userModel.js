const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        default: 'male'
    },
    address: {
        type: String,
        default: ''
    },
    phone_number: {
        type: Number,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: 'user'
    },
    api_key: {
        type: String,
        default: '',
    },
    is_deleted: {
        type: Boolean,
        default: false
    },

}, {
    timestamps: true,
})
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    this.api_key = uuidv4();
    next();
})
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({
        email: email, 
        is_deleted: false
    });
    if (user) {
        const isAuthenticated = await bcrypt.compare(password, user.password);
        if (isAuthenticated) {
            delete user.password;
            return user;
        }
        throw Error('incorrect password');
    } else {
        throw Error('incorrect email');
    }
}
const user = mongoose.model('user', userSchema);
module.exports = user;