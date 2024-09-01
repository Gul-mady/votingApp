const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const candidateModel = require('../models/candidateModel'); // Assuming this exists
require('dotenv').config();

module.exports = {

    // signup user
    register: async function (req, res) {
        try {
            const { role } = req.body;

            // Check if an admin already exists
            if (role === 'admin') {
                const existingAdmin = await userModel.findOne({ role: 'admin' });
                if (existingAdmin) {
                    return res.status(400).json({ message: "An admin already exists. Only one admin is allowed." });
                }
            }

            // Create a new user
            const user = await userModel.create(req.body);

            // Generate a JWT token
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

            // Respond with the token and user data
            res.status(201).json({
                message: "Signed up successfully",
                token: token,
                data: user
            });
        } catch (err) {
            // Handle errors and send an error response
            res.status(500).json({ message: "Something went wrong", error: err.message });
        }
    },

    // login user
    authenticate: async function (req, res, next) {
        try {
            // Extract identityCardNumber and password from request body
            const { identityCardNumber, password } = req.body;

            // Find the user by identityCardNumber
            const userInfo = await userModel.findOne({ identityCardNumber: identityCardNumber });
            if (!userInfo) {
                return res.status(401).json({ status: "error", message: "Authentication failed. User not found" });
            }
            const isMatch = await bcrypt.compare(password, userInfo.password);
            if (isMatch) {
                const token = jwt.sign({ id: userInfo._id }, process.env.JWT_SECRET); // payload
                return res.json({ status: "success", message: "User found!", token: token });
            } else {
                res.status(401).json({ status: "error", message: "Authentication failed. Wrong password" });
            }

        } catch (err) {
            return next(err);
        }
    },

    // update user
    updateUser: async (req, res) => {
        try {
            const userId = req.params.userId;
            const { currentPassword, newPassword } = req.body; // Extract current and new password from request body

            // Find user by userId
            const user = await userModel.findById(userId);

            if (!(await user.comparePassword(currentPassword))) {
                return res.status(404).json({ error: 'Invalid current password' });
            }
            // Update the user's password
            user.password = newPassword;
            await user.save();

            console.log('Password updated');
            res.status(200).json({ message: 'Password updated' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },



    getAll: async function (req, res) {
        try {
            const results = await userModel.find();
            res.status(200).json(results);
        } catch (err) {
            res.status(500).json({ message: "Something went wrong", error: err });
        }
    }
    ,


    getSingle: async function (req, res) {
        try {
            const result = await userModel.findById(req.params.userID);
            if (!result) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json(result);
        } catch (err) {
            res.status(500).json({ message: "Something went wrong", error: err });
        }
    }

};
