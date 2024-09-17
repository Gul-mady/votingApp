const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const candidateModel = require('../models/candidateModel'); // Assuming this exists
require('dotenv').config();

module.exports = {

    // Register user with image now
    register: async (req, res) => {
        try {
            const { role } = req.body;

            // Check if an admin already exists
            if (role === 'admin') {
                const existingAdmin = await userModel.findOne({ role: 'admin' });
                if (existingAdmin) {
                    return res.status(400).json({ message: "An admin already exists. Only one admin is allowed." });
                }
            }


            // Combine the file path with other data from req.body
            const userData = {
                ...req.body, // This spreads all the form fields from req.body
                profilePicture: req.file ? req.file.path : '' // Add the file path for the image
            };

            // Create a new user with combined data
            const user = await userModel.create(userData);

            // Generate a JWT token
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

            // After creating the user, you can exclude sensitive data:
            const { password, ...userWithoutPassword } = user.toObject();

            // Respond with the token and user data
            res.status(201).json({
                message: "Signed up successfully",
                token,
                data: userWithoutPassword
            });
        } catch (err) {
            // Send error response
            res.status(500).json({ message: "Something went wrong", error: err.message });
        }
    }
    ,


    //old signup user
    // register: async function (req, res) {
    //     try {
    //         const { role } = req.body;

    //         // Check if an admin already exists
    //         if (role === 'admin') {
    //             const existingAdmin = await userModel.findOne({ role: 'admin' });
    //             if (existingAdmin) {
    //                 return res.status(400).json({ message: "An admin already exists. Only one admin is allowed." });
    //             }
    //         }

    //         // Create a new user
    //         const user = await userModel.create(req.body);

    //         // Generate a JWT token
    //         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    //         // Respond with the token and user data
    //         res.status(201).json({
    //             message: "Signed up successfully",
    //             token: token,
    //             data: user
    //         });
    //     } catch (err) {
    //         // Handle errors and send an error response
    //         res.status(500).json({ message: "Something went wrong", error: err.message });
    //     }
    // },

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

            // Use the comparePassword method to verify the password
            const isMatch = await userInfo.comparePassword(password);

            if (isMatch) {
                const token = jwt.sign({ id: userInfo._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
                return res.json({ status: "success", message: "User found!", token: token });
            } else {
                return res.status(401).json({ status: "error", message: "Authentication failed. Wrong password" });
            }
        } catch (err) {
            return next(err);
        }
    }

    ,

    updateUser: async (req, res) => {
        try {
            const userId = req.params.userId;
            const { currentPassword, newPassword, name, email, age, mobile, address, profilePicture } = req.body;

            // Find user by userId
            const user = await userModel.findById(userId);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Update the password if both current and new passwords are provided
            if (currentPassword && newPassword) {
                const isMatch = await user.comparePassword(currentPassword);
                if (!isMatch) {
                    return res.status(400).json({ error: 'Invalid current password' });
                }
                user.password = newPassword; // Update password
            }

            // Update other fields if they are provided
            if (name) user.name = name;
            if (email) user.email = email;
            if (age) user.age = age;
            if (mobile) user.mobile = mobile;
            if (address) user.address = address;
            if (req.file) user.profilePicture = req.file.path; // Assuming profile picture is uploaded as a file

            await user.save();

            res.status(200).json({ message: 'User updated successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },


    // only admin can access Users list
    getAll: async function (req, res) {
        try {
            const results = await userModel.find();
            res.status(200).json(results);
        } catch (err) {
            res.status(500).json({ message: "Something went wrong", error: err });
        }
    }
    ,

    // user can see his data
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
