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
            className="w-12 h-10 bg-red-500 text-white flex items-center justify-center rounded-lg hover:bg-red-600"
        >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-6">
            <path fill-rule="evenodd" d="M8 1a.75.75 0 0 1 .75.75v6.5a.75.75 0 0 1-1.5 0v-6.5A.75.75 0 0 1 8 1ZM4.11 3.05a.75.75 0 0 1 0 1.06 5.5 5.5 0 1 0 7.78 0 .75.75 0 0 1 1.06-1.06 7 7 0 1 1-9.9 0 .75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
        </svg>

        </button>
    );
};

export default LogoutButton;