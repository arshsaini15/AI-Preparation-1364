import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./styles/Dashboard.css";

const Dashboard = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

    const fetchInterviews = async () => {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if(!token) {
        setError("No token found, please login again.");
        setLoading(false);
        return;
      }
    
      try {
        const res = await axios.get("http://localhost:8000/api/interview/mine", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });

        const data = Array.isArray(res.data?.interviews) ? res.data.interviews : [];
        setInterviews(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to fetch interviews");
      } finally {
        setLoading(false);
      }
    }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this interview?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/api/interview/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove deleted interview from state
      setInterviews((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  // ✅ Format date
  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <div className="dashboard">
      <div className="dash-header">
        <h1>Your Interviews</h1>
        <button className="primary" onClick={() => navigate("/interviews/create")}>
          + Create Interview
        </button>
      </div>

      {loading && <div className="card">Loading...</div>}
      {error && <div className="card error">{error}</div>}
      {!loading && !error && interviews.length === 0 && (
        <div className="card">No interviews yet. Click “Create Interview”.</div>
      )}

      <div className="grid">
        {interviews.map((interview) => (
          <div className="card" key={interview._id} onClick={() => navigate(`/interviews/start`, {
              state: {
                topic: interview.topic,
                difficulty: interview.difficulty
              }
            })}>
            <div className="row space">
              <h3 className="topic">{interview.topic || "Untitled"}</h3>
              <span className={`badge ${interview.difficulty?.toLowerCase() || ""}`}>
                {interview.difficulty || "N/A"}
              </span>
            </div>
            <div className="muted">{formatDate(interview.date)}</div>
            <div className="actions">
              <Link className="btn" to={`/interviews/update/${interview._id}`}>
                  Edit
              </Link>

              <button className="btn danger" onClick={() => handleDelete(interview._id)}>
                  Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;