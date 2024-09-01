# Voting Application

This is a backend application for a voting system where users can vote for candidates. It provides functionalities for user authentication, candidate management, and voting.

## Features

- User sign up and login with identity Card Number and password
- User can view the list of candidates
- User can vote for a candidate (only once)
- Admin can manage candidates (add, update, delete, get)
- Admin cannot vote

## Technologies Used

- Node.js
- Express.js
- MongoDB
- JSON Web Tokens (JWT) for authentication

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Gul-mady/votingApp.git


# API Endpoints

## Authentication

### Sign Up
- `POST /user/signup`: Sign up a user

### Login
- `POST /user/login`: Login a user

## Candidates

### Get Candidates
- `GET /candidate/getCandidates`: Get the list of candidates

### Add Candidate
- `POST /candidate/candidates`: Add a new candidate (Admin only)

### Update Candidate
- `PUT /candidate/:candidatesID`: Update a candidate by ID (Admin only)

### Delete Candidate
- `DELETE /candidate/:candidateID`: Delete a candidate by ID (Admin only)

## Voting

### Get Vote Count
- `GET /candidate/vote/count`: Get the count of votes for each candidate

### Vote for Candidate
- `POST /candidate/vote/:candidateID`: Vote for a candidate (User only)

## User Profile

### Get Profile
- `GET /user/profile/:userID`: Get user profile information

### Change Password
- `PUT /user/:userId`: Change user password
