import { useState, useEffect } from "react";

const Notifications = ({ userId }) => {
    const [friendRequests, setFriendRequests] = useState([]);
    //const [mentions, setMentions] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    const handleAcceptFriendRequest = async (friendId) => {
        try {
            const res = await fetch(`/api/users/acceptFriendRequest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, friendId }),
            });

            const data = await res.json();
            if (res.ok) {
                setFriendRequests((prev) => prev.filter((req) => req.firebaseUID !== friendId));
                alert(data.message);
            } else {
                console.error(data.message);
            }
        } catch (err){
            console.error("Error accepting friend request:", err);
        }
    };

    const handleRejectFriendRequest = async (friendId) => {
        try {
            const res = await fetch(`/api/users/rejectFriendRequest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, friendId }),
            });

            const data = await res.json();
            if (res.ok) {
                setFriendRequests((prev) => prev.filter((req) => req.firebaseUID !== friendId));
                alert(data.message);
            }
        } catch (err){
            console.error("Error rejecting friend request:", err);
        }
    };

    // fetch notifications
    useEffect (() => {
        const fetchNotifications = async () => {
            try {
                const friendRes = await fetch(`/api/users/${userId}/friendRequests`);
                //const mentions = await fetch(`/api/messages/${userId}/mentions`);

                if(friendRes.ok) {
                    const friendData = await friendRes.json();
                    setFriendRequests(friendData.friendRequests);
                    console.log(friendData.friendRequests);
                }
                // if(mentions.ok) {
                //     const mentionData = await mentions.json();
                //     setMentions(mentionData);
                // }
            } catch (err) {
                console.error("Error fetching notifications:", err);
            }
        };

        if(isVisible) {
            fetchNotifications();
        }
    }, [userId, isVisible]);

    return (
        <div className="relative">
            <button
                onClick={() => setIsVisible(!isVisible)}
                className="w-12 h-10 bg-blue-500 text-white flex items-center justify-center rounded-lg hover:bg-blue-600"
            >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
            </svg>

            </button>

            {isVisible && (
                <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg w-96 p-4 flex space-x-4 z-10">
                    {/* Friend Requests */}
                    <div className="w-1/2">
                        <h3 className="text-lg font-semibold mb-2">Friend Requests</h3>
                        {Array.isArray(friendRequests) && friendRequests.length > 0 ? (
                            friendRequests.map((request) => (
                                <div key={request._id} className="mb-2">
                                    <p className="font-medium">{request.username}</p>
                                    <button
                                        className="bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600 mr-2"
                                        onClick={() => handleAcceptFriendRequest(request.firebaseUID)}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                                        onClick={() => handleRejectFriendRequest(request._id)}
                                    >
                                        Reject
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No friend requests</p>
                        )}
                    </div>

                    {/* Mentions */}
                    <div className="w-1/2">
                        <h3 className="text-lg font-semibold mb-2">Mentions</h3>
                            <p className="text-gray-500">No mentions</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;