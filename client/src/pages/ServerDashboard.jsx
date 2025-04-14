import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CreateChannel from "../components/CreateChannel";
import ChatInterface from "../components/ChatInterface";

const ServerDashboard = ({userId}) => {
  const { serverId } = useParams();
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [friendUsername, setFriendUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleInviteFriend = async () => {
    try {
      const res = await fetch(`/api/servers/${serverId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendUsername }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setFriendUsername('');
      } else {
        setMessage(data.message || "Error inviting friend.");
      }
    } catch (err) {
      console.error("Error inviting friend:", err);
      setMessage("Error inviting friend.");
    }
  };

  const fetchParticipants = async () => {
    try {
      const res = await fetch(`/api/servers/${serverId}`);
      const data = await res.json();
      if(res.ok){
        setParticipants(data.members);
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  const handleRemoveParticipant = async (participantUsername) => {
    try {
      const res = await fetch(`/api/servers/${serverId}/removeParticipant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantUsername }),
      });

      const data = await res.json();
      if (res.ok) {
        setParticipants((prev) => prev.filter((p) => p.username !== participantUsername));
      } else {
        console.error(data.message);
      }
    } catch (err){
      console.error("Error removing participant:", err);
    }
  };

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await fetch(`/api/channels/server/${serverId}`);
        const data = await res.json();
        if (res.ok) {
          setChannels(data);
        }
      } catch (error) {
        console.error("Error fetching channels:", error);
      }
    };

    fetchChannels();
  }, [serverId]);

  const handleChannelCreated = (newChannel) => {
    setChannels((prev) => [...prev, newChannel]);
  };

  return (
    <div className="h-screen flex">
      {/* Left Sidebar */}
      <div className="w-1/3 bg-gray-100 p-4 overflow-y-auto">
        <button
          className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
          onClick={() => navigate("/home")}
        >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
        </svg>

        </button>

        <h1 className="text-xl font-bold mb-4">Server Dashboard</h1>

        <div className="relative">
            <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                onClick={(e) => {
                    const dropdown = e.currentTarget.nextSibling;
                    dropdown.classList.toggle("hidden");
                }}
            >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>

            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg hidden">
                <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={(e) => {
                        setIsCreateChannelModalOpen(true);
                        e.currentTarget.parentElement.classList.add("hidden");
                    }}
                >
                    Create Channel
                </button>
                <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={(e) => {
                        setIsInviteModalOpen(true);
                        e.currentTarget.parentElement.classList.add("hidden");
                    }}
                >
                    Invite Friend
                </button>
                <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={(e) => {
                        setIsParticipantsModalOpen(true);
                        fetchParticipants();
                        e.currentTarget.parentElement.classList.add("hidden");
                    }}
                > 
                    Show Participants
                </button>
            </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-medium mb-2">Channels</h2>
          <ul className="space-y-2">
            {channels.map((channel) => (
              <li
                key={channel._id}
                className={`p-2 rounded-lg cursor-pointer border hover:bg-blue-100 ${
                  selectedChannel?._id === channel._id ? "bg-blue-100" : "bg-white"
                }`}
                onClick={() => setSelectedChannel(channel)}
              >
                {channel.name} ({channel.type})
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="w-2/3 p-6 bg-white flex items-center justify-center">
        {selectedChannel ? (
          <div className="w-full">
            <h2 className="text-lg font-medium mb-4">Chat: {selectedChannel.name}</h2>
            <ChatInterface channelId={selectedChannel._id} userId={userId} />
          </div>
        ) : (
          <div className="text-center text-gray-400">
            <img
              src="https://cdn-icons-png.flaticon.com/512/9068/9068756.png"
              alt="No channel selected"
              className="w-48 mx-auto mb-4 opacity-70"
            />
            <p className="text-lg">Select a channel to start chatting</p>
          </div>
        )}
      </div>
        
        {/* Invite Friend Modal */}
        {isInviteModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Invite a Friend</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setIsInviteModalOpen(false);
                    setFriendUsername('');
                    setMessage('');
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <input
                type="text"
                placeholder="Friend's Username"
                value={friendUsername}
                onChange={(e) => setFriendUsername(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg w-full mb-4"
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mr-2"
                onClick={handleInviteFriend}
              >
                Invite
              </button>
              {message && <p className="mt-2 text-gray-600">{message}</p>}
            </div>
          </div>
        )}

        {/* Participants Modal */}
        {isParticipantsModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Participants</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setIsParticipantsModalOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <ul className="space-y-2">
                {participants.map((participant) => (
                  <li
                    key={participant._id}
                    className="flex justify-between items-center p-2 border rounded-lg"
                  >
                    <span>{participant.username}</span>
                    {participant.firebaseUID !== userId && (
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                        onClick={() => handleRemoveParticipant(participant.username)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>

                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Create Channel Modal */}
        {isCreateChannelModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 flex flex-col items-center">
              <div className="flex justify-between items-center mb-4 w-full">
                <h2 className="text-lg font-bold">Create Channel</h2>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setIsCreateChannelModalOpen(false)}
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>

                  </button>
                </div>
                <CreateChannel
                    serverId={serverId}
                    onChannelCreated={handleChannelCreated}
                />
            </div>
          </div>
        )}
    </div>
  );
};

export default ServerDashboard;
