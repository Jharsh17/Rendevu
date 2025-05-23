import { useState } from "react";
import { getAuth } from "firebase/auth";

const UsernameSetup = ({ userId, onUsernameSet }) => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // fetch email from Firebase Auth
            const auth = getAuth();
            const user = auth.currentUser;

            if(!user || user.uid !== userId) {
                throw new Error("User not authenticated or mismatched userId");
            }

            const email = user.email;
            
            const res = await fetch('/api/users/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firebaseUID: userId, username, email})
            });
    
            const data = await res.json();
    
            if (data.success) {
                onUsernameSet(username);
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to fetch email or set username");
        }        
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-medium text-gray-700">Choose a username</h2>
            <input
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter a unique username"
            />
            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
                Set Username
            </button>
            {error && <p className="text-red-500">{error}</p>}
        </form>
    );
};

export default UsernameSetup;
