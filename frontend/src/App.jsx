import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

import Navbar from "./Navbar"

import Signup from "./Signup"
import Signin from "./Signin"
import Dashboard from "./Dashboard"
import EditInterview from "./EditInterview"
import CreateInterview from "./createInterview"


function App() {
    return (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/interview/update/:id" element={<EditInterview />} />
            <Route path="/interviews/create" element={<CreateInterview />} / >
          </Routes>
        </>
    );
}

export default App;