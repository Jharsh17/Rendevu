import { useState } from "react";
import React from 'react';

const SendFriendRequest = ({userId}) => {
    const [searchUser, setSearchUser] = useState('');
    const [message, setMessage] = useState('');

    const handleSendFriendRequest = async () => {
        try {
            const res = await fetch(`/api/users/sendFriendRequest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, friendId: searchUser }),
            });
    
            const data = await res.json();
            setMessage(data.message);
        } catch (err) {
            console.error("Error sending friend request:", err);
            setMessage('Error sending friend request');
        }        
    };

    return (
        <div className="flex items-center space-x-2">
            <input
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                placeholder="Friend Username"
            />
            <button
                onClick={handleSendFriendRequest}
                className="w-12 h-10 bg-green-500 text-white rounded-lg flex items-center justify-center hover:bg-green-600"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                </svg>

            </button>
            {message && <p className="text-gray-600">{message}</p>}
        </div>
    );
};

export default SendFriendRequest;
