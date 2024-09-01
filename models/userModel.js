const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: null, // Consider setting this to true if name is mandatory
    },
    email: {
        type: String,
        unique: true, // Assuming email should be unique for each user
        required: null, // Consider setting this to true if email is mandatory
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    mobile: {
        type: String,
    },
    address: {
        type: String,
        required: true,
    },
    identityCardNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter',
    },
    isVoted: {
        type: Boolean,
        default: false,
    }
});

// Pre-save hook to hash the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        return next(err);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (userPassword) {
    if (!userPassword || !this.password) {
        throw new Error('Password or hash not provided');
    }
    return await bcrypt.compare(userPassword, this.password);
};



mongoose.pluralize(null); // Prevent Mongoose from pluralizing collection names

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
