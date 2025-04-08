import React, { useState } from 'react';
import UsernameSetup from '../components/UsernameSetup';
import AddFriend from '../components/AddFriend';
import LogoutButton from '../components/LogoutButton';

const Home = ({ userId }) => {
    const [username, setUsername] = useState(null);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 relative">
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
                        <div className="absolute top-4 right-4">
                            <AddFriend />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
