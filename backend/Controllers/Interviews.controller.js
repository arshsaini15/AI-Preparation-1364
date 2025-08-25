const Interview = require('../Models/interview.models.js')
const User = require('../Models/user.models.js')

const createInterview = async (req, res, next) => {
    try {
        const { topic, difficulty } = req.body;
        const userId = req.user?.id
        console.log("userId : ", userId);
        
    
        if (!userId || !topic || !difficulty) {
            const error = new Error("User ID and interview details are required");
            error.statusCode = 400;
            throw error;
        }
    
        const newInterview = await Interview.create({
            userId,
            topic,
            difficulty,
            date: new Date()
        })
    
        if (!newInterview) {
            const error = new Error("Failed to add interview information");
            error.statusCode = 500;
            throw error;
        }
    
        res.status(201).json({
            message: "Interview information added successfully",
            interview: newInterview
        })
    } catch (error) {
        next(error)
    }
}

const updateInterviewController = async (req, res) => {
    try {
        const { id } = req.params;

        if(!id) {
            return res.status(400).json({ message: "Interview ID is required" });
        }

        const {date, topic, difficulty } = req.body;

        const interview = await Interview.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            { date, topic, difficulty },
            { new: true}
        );

        if (!interview) {
            return res.status(404).json({ message: "Interview not found or not authorized" });
        }

        res.json({ message: "Interview updated successfully", interview });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const deleteInterviewController = async (req, res) => {
    try {
        const { id } = req.params;

        if(!id) {
            return res.status(400).json({ message: "Interview ID is required" });
        }

        const interview = await Interview.findOneAndDelete({
            _id: id,
            userId: req.user.id
        })

        if (!interview) {
            return res.status(404).json({ message: "Interview not found or not authorized" });
        }

        res.json({ message: "Interview deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const fetchInterviewsController = async(req, res) => {
    try {
        const interviews = await Interview.find({ userId: req.user?.id })
            .populate('userId', 'name email')

        if(!interviews) {
            return res.status(404).json({message: "No interviews found"});
        }
        res.json({
            message: "success",
            interviews: interviews
        })
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {createInterview, updateInterviewController, deleteInterviewController, fetchInterviewsController}