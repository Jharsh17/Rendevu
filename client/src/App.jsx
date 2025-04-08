import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "./firebase";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To prevent flicker on load

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
        <Route path="/" element={!user ? <Login/> : <Home />} />
        <Route path="/home" element={<Home userId={user?.uid}/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default App;
