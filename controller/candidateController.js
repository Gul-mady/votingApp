const candidateModel = require('../models/candidateModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { model } = require('mongoose');
const { response } = require('express');
require('dotenv').config();
const userModel = require('../models/userModel')


const checkAdminRole = async (userId) => {
    try {
        const user = await userModel.findById(userId);
        return user.role === 'admin';
    } catch (err) {
        return false;
    }
};

module.exports = {

    // signup admin
    register: async function (req, res) {
        try {
            // Check if the user has an admin role
            const isAdmin = checkAdminRole(req.user.id);
            if (!isAdmin) {
                console.log('Admin role not found');
                return res.status(403).json({ message: 'User does not have admin role' });
            }

            // Log admin role confirmation
            // console.log('Admin role found');

            // Create a new candidate
            const newCandidate = await candidateModel.create(req.body);

            // console.log('Data saved');
            // Respond with the candidate data
            res.status(201).json({
                message: 'Candidate signed up',
                adminRoleConfirmed: true,
                data: newCandidate
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Something went wrong', error: err.message });
        }
    },


    // update candidate
    updateCandidate: async (req, res) => {
        try {
            // Check if the user has an admin role
            const isAdmin = checkAdminRole(req.user.id);
            if (!isAdmin) {
                return res.status(403).json({ message: 'User does not have admin role' });
            }

            // Update the candidate's data
            const updatedCandidate = await candidateModel.findByIdAndUpdate(
                req.params.candidateID,
                req.body,
                { new: true } // Return the updated document
            );

            if (!updatedCandidate) {
                return res.status(404).json({ message: 'Candidate not found' });
            }

            return res.status(200).json({ message: 'Candidate data updated', data: updatedCandidate });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    removeCandidate: async function (req, res) {
        try {
            // Check if the user has an admin role
            const isAdmin = checkAdminRole(req.user.id);
            if (!isAdmin) {
                return res.status(403).json({ message: 'User does not have admin role' });
            }

            // Find and delete the candidate by ID
            const deletedCandidate = await candidateModel.findByIdAndDelete(req.params.candidateID);

            // If no candidate was found, return a 404 response
            if (!deletedCandidate) {
                return res.status(404).json({ message: 'Candidate not found' });
            }

            // Return success response
            return res.status(200).json({ message: 'Your selected data has been deleted from the database', data: deletedCandidate });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Something went wrong', error: err });
        }
    },

    // let's start voting
    userVote: async (req, res) => {
        const candidateID = req.params.candidateID;
        const userId = req.user.id;

        try {
            // Find the candidate by ID
            const candidate = await candidateModel.findById(candidateID);
            if (!candidate) {
                return res.status(404).json({ message: 'Candidate does not exist' });
            }

            // Find the user by ID
            const user = await userModel.findById(userId); // Make sure userModel is properly imported
            if (!user) {
                return res.status(404).json({ message: 'User does not exist' });
            }

            if (user.age < 18) {
                return res.status(403).json({ message: 'You are not eligible to vote because you are under 18' });
            }
            // Check if the user has already voted
            if (user.isVoted) {
                return res.status(400).json({ message: 'You have already voted' }); // isVoted is boolean field form userModel
            }

            // Check if the user is an admin
            if (user.role === 'admin') {
                return res.status(403).json({ message: 'Admin is not allowed to vote' });
            }

            // Update the candidate document to record the vote
            candidate.votes.push({ user: userId });
            candidate.voteCount++; // Ensure candidate.voteCount exists and is incrementable
            await candidate.save();

            // Update the user document to mark as voted
            user.isVoted = true;
            await user.save();

            // Send success response
            return res.status(200).json({ message: 'Vote recorded successfully' });

        } catch (err) {
            console.error(err);
            // Ensure that error response is sent only once
            if (!res.headersSent) {
                return res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
    ,


    voteCount: async (req, res) => {
        try {
            const candidates = await candidateModel.find().sort({ voteCount: 'desc' });

            // Map the candidates to return their voteCount and party name
            const voteRecord = candidates.map(candidate => {
                return {
                    party: candidate.party,
                    count: candidate.voteCount
                };
            });

            return res.status(200).json({ voteRecord });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },



    getAll: async function (req, res) {
        try {
            const results = await candidateModel.find();
            res.status(200).json(results);
        } catch (err) {
            res.status(500).json({ message: "Something went wrong", error: err });
        }
    }




}