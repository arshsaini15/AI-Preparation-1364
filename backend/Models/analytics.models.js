const mongoose = require('mongoose');
const { use } = require('react');

const analyticsSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    summary : {
        type: Object,
        default: {}
    },
    accuracy : {
        type: Number,
        default: 0
    },
    improvementAreas : {
        type: [String],
        default: []
    },
});

const Analytics = mongoose.model('Analytics', analyticsSchema);