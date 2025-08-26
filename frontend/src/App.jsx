import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Signup from "./Signup";
import Signin from "./Signin";
import Dashboard from "./Dashboard";
import EditInterview from "./EditInterview";
import CreateInterview from "./createInterview";
import Interview from "./Interview";

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/interviews/update/:id" element={<EditInterview />} />
                <Route path="/interviews/create" element={<CreateInterview />} />
                <Route path="/interviews/start" element={<Interview />} />
            </Routes>
        </>
    );
}

export default App;