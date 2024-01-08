const mongoose = require('mongoose');

const schema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    phoneNumber: {
        type: Number,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
});

module.exports = mongoose.model('user-admin', schema);