const mongoose = require('mongoose')
mongoose.pluralize(null)
// const bcrypt = require('bcrypt')



const candidateSchema = new mongoose.Schema({

  name: {
    type: String,
    required: null,
  },
  party: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  votes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        isVoted: Date.now()
      },
      votedAt: {
        type: Date,
        default: Date.now()
      }
    }
  ],
  voteCount: {
    type: Number,
    default: 0
  }
})


const candidateModel = mongoose.model('Candidate', candidateSchema)
module.exports = candidateModel;