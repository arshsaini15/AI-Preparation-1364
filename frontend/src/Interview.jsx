import { useState, useEffect } from 'react'
import { useLocation } from "react-router-dom";
import axios from 'axios'
import './styles/Interview.css'

const Interview = () => {
    const [chat, setChat] = useState([])
    const [input, setInput] = useState('')
    const [currentQuestionId, setCurrentQuestionId] = useState(null)
    const [loading, setLoading] = useState(true)

    const location = useLocation();
    const { topic, difficulty } = location.state || {};


    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.id;

    const token = localStorage.getItem('token')

    const startInterview = async () => {
        try {
            const res = await axios.post(
                'http://localhost:8000/api/interview/start',
                {
                    userId,
                    topic,
                    difficulty,
                    date: new Date(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setChat([{ user: '', ai: res.data.aiQuestion, id: res.data.interviewId }])
            setCurrentQuestionId(res.data.aiQuestionId)
            setLoading(false)
        } catch (error) {
            console.error('Error starting interview:', error)
            setLoading(false)
        }
    }

    const sendAnswer = async () => {
        if (!input.trim()) return
        try {
            const res = await axios.post('http://localhost:8000/api/interview/answer', {
                userId,
                questionId: currentQuestionId,
                answer: input,
                topic,
                difficulty
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setChat(prev => [...prev, { user: input, ai: res.data.aiQuestion }]);
            setCurrentQuestionId(res.data.aiQuestionId);
            setInput('');
        } catch (error) {
            console.error('Error sending answer:', error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendAnswer();
        }
    };

    useEffect(() => {
        startInterview();
    }, []);

    return (
        <div className="interview-container">
            <h2 className="interview-title">Mock Interview</h2>
            {loading ? (
                <div className="loading-container">
                    <p>Loading your first question...</p>
                </div>
            ) : (
                <>
                    <div className="chat-box">
                        {chat.map((c, i) => (
                            <div key={i} className="chat-message">
                                {c.user && <div className="user-msg"><strong>You:</strong> {c.user}</div>}
                                {c.ai && <div className="ai-msg"><strong>AI:</strong> {c.ai}</div>}
                            </div>
                        ))}
                    </div>

                    <div className="input-container">
                        <div className="input-box">
                            <textarea
                                className="chat-input"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your answer here... (Press Enter to send, Shift+Enter for new line)"
                                rows="3"
                            />
                        </div>
                        <button 
                            className="submit-btn" 
                            onClick={sendAnswer}
                            disabled={!input.trim()}
                        >
                            Send
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default Interview