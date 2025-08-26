import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./styles/Dashboard.css";

const Dashboard = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();

  const fetchInterviews = async () => {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found, please login again.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:8000/api/interview/mine", {
          headers: { Authorization: `Bearer ${token}` },
      })

      const interviewsArray = Array.isArray(res.data)
        ? res.data
        : res.data.interviews || []

      console.log('Raw interviews from API:', interviewsArray); // Debug log

      // Improved deduplication: group by _id and keep the most recent one
      const uniqueInterviews = Array.from(
        interviewsArray.reduce((map, interview) => {
          const existing = map.get(interview._id);
          if (!existing || new Date(interview.date) > new Date(existing.date)) {
            map.set(interview._id, interview);
          }
          return map;
        }, new Map()).values()
      );

      console.log('Unique interviews after deduplication:', uniqueInterviews); // Debug log
      setInterviews(uniqueInterviews);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || "Failed to fetch interviews");
      } finally {
        setLoading(false);
      }
    }

  const handleCardClick = (interview) => {
    if (isNavigating) return; // Prevent multiple clicks
    
    setIsNavigating(true);
    navigate(`/interviews/start`, { 
      state: {
        topic: interview.topic, 
        difficulty: interview.difficulty,
        interviewId: interview._id
      } 
    });
    
    // Reset after navigation
    setTimeout(() => setIsNavigating(false), 1000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this interview?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/api/interview/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInterviews((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  // Re-fetch when component becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchInterviews();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const formatDate = (iso) => {
    try { return new Date(iso).toLocaleString(); } 
    catch { return iso; }
  };

  return (
    <div className="dashboard">
      <div className="dash-header">
        <h1>Your Interviews</h1>
        <button className="primary" onClick={() => navigate("/interviews/create")}>
          + Create Interview
        </button>
      </div>

      <div className="grid">
        {loading ? (
          <div className="card">Loading...</div>
        ) : error ? (
          <div className="card error">{error}</div>
        ) : interviews.length === 0 ? (
          <div className="card">No interviews yet. Click "Create Interview".</div>
        ) : (
          interviews.map((interview) => (
            <div 
              className="card" 
              key={interview._id}
              onClick={() => handleCardClick(interview)}
              style={{ opacity: isNavigating ? 0.7 : 1, cursor: isNavigating ? 'wait' : 'pointer' }}
            >
              <div className="row space">
                <h3 className="topic">{interview.topic || "Untitled"}</h3>
                <span className={`badge ${interview.difficulty?.toLowerCase() || ""}`}>
                  {interview.difficulty || "N/A"}
                </span>
              </div>
              <div className="muted">{formatDate(interview.date)}</div>
              <div className="actions" onClick={(e) => e.stopPropagation()}>
                <Link className="btn" to={`/interviews/update/${interview._id}`}>
                    Edit
                </Link>

                <button className="btn danger" onClick={(e) => { 
                  e.stopPropagation();  
                  handleDelete(interview._id);
                }}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Dashboard