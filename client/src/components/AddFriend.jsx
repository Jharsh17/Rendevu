import { useState } from "react";
import React from 'react';

const AddFriend = () => {
    const [search, setSearch] = useState('');
    const [result, setResult] = useState(null);
    const [message, setMessage] = useState('');

    const handleSearch = async () => {
        const res = await fetch(`/api/search-user?username=${search}`);
        const data = await res.json();

        if (data.user) {
            setResult(data.user);
            setMessage('');
        } else {
            setResult(null);
            setMessage('User not found');
        }
    };

    const handleAddFriend = async () => {
        const res = await fetch(`/api/add-friend`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ friendUsername: result.username })
        });

        const data = await res.json();
        setMessage(data.message);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-700">Add a friend</h2>
            <input
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Username"
            />
            <button
                onClick={handleSearch}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
                Search
            </button>

            {result && (
                <div className="space-y-2">
                    <p className="text-green-700">Found: {result.username}</p>
                    <button
                        onClick={handleAddFriend}
                        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                    >
                        Add Friend
                    </button>
                </div>
            )}
            {message && <p className="text-gray-600">{message}</p>}
        </div>
    );
};

export default AddFriend;
