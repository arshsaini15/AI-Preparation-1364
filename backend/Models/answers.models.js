const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    question_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    user_response: {
        type: String,
        required: true
    },
    score : {
        type: Number,
        required: true
    },
    feedback : {
        type: String,
        default: ''
    }
});

const Answer = mongoose.model('Answer', answerSchema);