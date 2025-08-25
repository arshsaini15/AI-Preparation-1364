const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date : {
        type: Date,
        required: true,
    },
    topic : {
        type: String,
        required: true
    },
    difficulty : {
        type: String,
        required: true
    }
});

const Interview = mongoose.model('Interview', interviewSchema);
module.exports = Interview;