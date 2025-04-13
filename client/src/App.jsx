import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// Page imports
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import ServerDashboard from "./pages/ServerDashboard";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={!user ? <Login /> : <Navigate to="/home" />} />

        {/* Authenticated Home */}
        <Route path="/home" element={user ? <Home userId={user.uid} /> : <Navigate to="/" />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Server Dashboard */}
        <Route path="/server/:serverId" element={user ? <ServerDashboard /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
