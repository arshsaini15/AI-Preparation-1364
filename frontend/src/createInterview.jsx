import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/EditInterview.css"; // Reuse same CSS

const CreateInterview = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const topics = [
    "Data Structures",
    "Algorithms",
    "System Design",
    "Databases",
    "Networking",
    "Operating Systems",
    "React",
    "Node.js",
    "JavaScript",
  ];

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please login first");
      navigate("/signin");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "http://localhost:8000/api/interview/create",
        { topic, difficulty },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Interview created successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Failed to create interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-container">
      <h2>Create Interview</h2>
      <form onSubmit={handleCreate} className="edit-form">
        <div className="form-group">
          <label>Topic:</label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a topic
            </option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
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

        <button type="submit" className="update-btn" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
};

export default CreateInterview