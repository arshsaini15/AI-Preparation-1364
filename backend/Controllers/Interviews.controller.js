const User = require('../Models/user.models.js')
const Interview = require('../Models/interview.models.js')
const Question = require('../Models/questions.models.js')
const Answer = require('../Models/answers.models.js')

const groq = require('groq-js');
const groqClient = groq({ apiKey: process.env.GROQ_API_KEY });

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

const startInterviewController = async (req, res) => {
  try {
    const { userId, topic, difficulty, date } = req.body;

    if (!userId || !topic || !difficulty) {
      return res.status(400).json({ error: "userId, topic, and difficulty are required" });
    }

    // Save interview in MongoDB
    const interview = new Interview({ userId, topic, difficulty, date });
    await interview.save();

    let aiQuestion = "Sample AI question";
    let aiQuestionId = null;

    try {
      // Use Groq SDK to generate question
      const response = await groqClient.generateQuestion({ topic, difficulty });
      aiQuestion = response.question;

      const question = new Question({
        user_id: userId,
        question_text: aiQuestion,
        generated_by: 'ai'
      });
      await question.save();
      aiQuestionId = question._id;

    } catch (groqError) {
      console.error("Groq API failed:", groqError.message);
    }

    res.status(201).json({
      interviewId: interview._id,
      aiQuestion,
      aiQuestionId
    });

  } catch (error) {
    console.error('Error in startInterviewController:', error.message);
    res.status(500).json({ error: 'Failed to start interview' });
  }
};

const answerInterviewController = async (req, res) => {
  try {
    const { userId, questionId, answer, topic, difficulty } = req.body;

    const previousQuestion = await Question.findById(questionId);
    if (!previousQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Use Groq SDK to evaluate answer
    const aiResponse = await groqClient.evaluateAnswer({
      question: previousQuestion.question_text,
      answer,
      topic,
      difficulty
    });

    const feedback = aiResponse.feedback || "No feedback provided";
    const score = aiResponse.score || 0;
    const nextQuestionText = aiResponse.nextQuestion || "No next question provided";

    // Save user's answer
    const savedAnswer = new Answer({
      user_id: userId,
      question_id: questionId,
      user_response: answer,
      score,
      feedback
    });
    await savedAnswer.save();

    // Save next AI-generated question
    const aiQuestion = new Question({
      user_id: userId,
      question_text: nextQuestionText,
      generated_by: 'ai'
    });
    await aiQuestion.save();

    res.json({
      feedback,
      score,
      aiQuestion: nextQuestionText,
      aiQuestionId: aiQuestion._id
    });

  } catch (error) {
    console.error('Error in answerInterviewController:', error.message);
    res.status(500).json({ error: 'Failed to process answer' });
  }
}

module.exports = {createInterview, updateInterviewController, deleteInterviewController, fetchInterviewsController, startInterviewController, answerInterviewController }