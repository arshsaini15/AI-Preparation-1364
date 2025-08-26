import { useState, useEffect } from 'react'
import { useLocation } from "react-router-dom";
import axios from 'axios'
import './styles/Interview.css'

const Interview = () => {
    const [chat, setChat] = useState([])
    const [input, setInput] = useState('')
    const [currentQuestionId, setCurrentQuestionId] = useState(null)
    const [loading, setLoading] = useState(true)
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.id;

    const location = useLocation();
    const { topic, difficulty } = location.state || {};
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
            const res = await axios.post('/api/interview/answer', {
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

    useEffect(() => {
        startInterview();
    }, []);

    return (
        <div className="interview-container">
            <h2 className="interview-title">Mock Interview</h2>
            {loading ? (
                <p>Loading your first question...</p>
            ) : (
                <>
                    <div className="chat-box">
                        {chat.map((c, i) => (
                            <div key={i} className="chat-message">
                                {c.user && <p className="user-msg"><strong>You:</strong> {c.user}</p>}
                                {c.ai && <p className="ai-msg"><strong>AI:</strong> {c.ai}</p>}
                            </div>
                        ))}
                    </div>

                    <div className="input-box">
                        <input
                            className="chat-input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your answer..."
                        />
                        <button className="submit-btn" onClick={sendAnswer}>Submit</button>
                    </div>
                </>
            )}
        </div>
    )
}

export default Interview