const express = require('express')
const router = express.Router()
const jwtAuth = require('../jwtAuth');
const candidateController = require('../controller/candidateController');

router.post('/', jwtAuth, candidateController.register); // only Admin can lists the Candidates for election
router.put('/:candidateID', jwtAuth, candidateController.updateCandidate); //only Admin can update data of Candidates
router.delete('/:candidateID', jwtAuth, candidateController.removeCandidate) // only Admin can delete data of Candidates
router.post('/vote/:candidateID', jwtAuth, candidateController.userVote); // only user can vote 
router.get('/vote/count', candidateController.voteCount); // voteCounts of each candidate
router.get('/getCandidates', jwtAuth, candidateController.getAll); // only admin can see candidates list

module.exports = router