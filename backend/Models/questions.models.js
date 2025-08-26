const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    user_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    question_text: {
        type: String,
        required: true
    },
    generated_by : {
        type: String,
        required: true,
        enum: ['user', 'ai']
    }
});

const Question = mongoose.model('Question', questionSchema)
module.exports = Question