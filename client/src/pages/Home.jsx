import React, { useEffect, useState } from 'react';
import UsernameSetup from '../components/UsernameSetup';
import AddFriend from '../components/AddFriend';
import LogoutButton from '../components/LogoutButton';

const Home = ({ userId }) => {
    const [username, setUsername] = useState(null);
    const [servers, setServers] = useState([]);
    const [showAddServerModal, setShowAddServerModal] = useState(false);
    const [newServerName, setNewServerName] = useState('');

    // Fetch username from backend if exists
    useEffect(() => {
        if(userId){
            const fetchUsername = async () => {
                try {
                    const response = await fetch(`/api/users/${userId}`);
                    const data = await response.json();
                    if(response.ok && data.username){
                        setUsername(data.username);
                    }
                } catch (error) {
                    console.error('Error fetching username:', error);
                }
            };
            fetchUsername();
        } else{
            console.log("Error fetching username");
        }
    }, [userId]);

    // Fetch servers for the user
    useEffect(() => {
        if(username) {
            const fetchServers = async () => {
                try {
                    const response = await fetch(`/api/servers/user/${userId}`);
                    const data = await response.json();
                    setServers(data);
                } catch (error) {
                    console.error('Error fetching servers:', error);
                }
            };
            fetchServers();
        }
    }, [username, userId]);

    //Add server function
    const handleAddServer = async () => {
        if(!newServerName.trim()) return; // Prevent empty server names

        try {
            const response = await fetch('/api/servers/create', {
                method: 'POST',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify({name: newServerName, owner: userId}),
            });

            const data = await response.json();
            if(response.ok) {
                setServers((prev) => [...prev, data]);
                setShowAddServerModal(false);
                setNewServerName('');
            } else{
                console.error('Error creating server:', data.message);
            }
        } catch (error) {
            console.error('Error creating server:', error);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            {username && (
                <div className="w-1/4 bg-white shadow-lg flex flex-col">
                    <h2 className="text-lg font-semibold p-4 border-b">Servers</h2>
                    <ul className="p-4 space-y-2 flex-1 overflow-y-auto">
                        {servers.map((server) => (
                            <li key={server._id} className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer">
                                {server.name}
                            </li>
                        ))}
                    </ul>
                    <button 
                        className="m-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        onClick={() => setShowAddServerModal(true)}
                    >
                        Add Server
                    </button>
                </div>
            )}

            {/* Main content area */}
            <div className={`flex-1 flex flex-col items-center justify-center p-4 ${username ? 'relative': ''}`}>
                <LogoutButton/>
                <div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow-md">
                    {!username ? (
                        <UsernameSetup 
                            userId={userId} 
                            onUsernameSet={(name) => setUsername(name)} 
                        />
                    ) : (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">
                                Welcome, {username}!
                            </h2>
                            <div className="absolute top-4 right-25">
                                <AddFriend />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Add Server Modal */}
            {showAddServerModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-semibold mb-4">Create a New Server</h2>
                        <input
                            type="text"
                            value={newServerName}
                            onChange={(e) => setNewServerName(e.target.value)}
                            placeholder="Server Name"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        />
                        <div className="flex justify-end spaace-x-4">
                            <button
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                onClick={() => setShowAddServerModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                onClick={handleAddServer}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
