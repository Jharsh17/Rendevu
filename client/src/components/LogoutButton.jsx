import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import {useNavigate} from 'react-router-dom';
import React from 'react';


const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');      // redirect to login page
            console.log("Logout Successful");
        } catch (error) {
            console.error("Logout Failed", error.message);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
            Logout
        </button>
    );
};

export default LogoutButton;