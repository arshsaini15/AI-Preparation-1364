import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/EditInterview.css";

const EditInterview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [date, setDate] = useState("");
    const [topic, setTopic] = useState("");
    const [difficulty, setDifficulty] = useState("easy");
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {
      if (!token) {
        navigate("/signin");
        return;
      }

      axios
        .get(`http://localhost:8000/api/interview/mine`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const interview = res.data.interview;
          setDate(interview.date.split("T")[0]);
          setTopic(interview.topic);
          setDifficulty(interview.difficulty);
          setLoading(false);
        })
        .catch(() => {
          alert("Failed to fetch interview details");
          navigate("/dashboard");
        });
    }, [id, token, navigate]);

    const handleUpdate = async (e) => {
      e.preventDefault();

      try {
        await axios.put(
          `http://localhost:8000/api/interview/${id}`,
          { date, topic, difficulty },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("Interview updated successfully");
        navigate("/dashboard");
      } catch (error) {
        console.error(error);
        alert("Failed to update interview");
      }
    };

    if (loading) return <p>Loading...</p>;

    return (
      <div className="edit-container">
        <h2>Edit Interview</h2>
        <form onSubmit={handleUpdate} className="edit-form">
          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Topic:</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Difficulty:</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <button type="submit" className="update-btn">Update</button>
        </form>
      </div>
    );
};

export default EditInterview;