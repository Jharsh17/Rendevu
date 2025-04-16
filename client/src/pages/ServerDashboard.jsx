import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CreateChannel from "../components/CreateChannel";
import ChatInterface from "../components/ChatInterface";
import VoiceCall from "../components/VoiceCall";

const ServerDashboard = ({ userId }) => {
  const { serverId } = useParams();
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [server, setServer] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [friendUsername, setFriendUsername] = useState('');
  const [message, setMessage] = useState('');
  const [isJoinVoiceCall, setIsJoinVoiceCall] = useState(false);


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
    const fetchServer = async () => {
      try {
        const res = await fetch(`/api/servers/${serverId}`);
        const data = await res.json();
        if (res.ok) {
          setServer(data);
        }
      } catch (error) {
        console.error("Error fetching server:", error);
      }
    };
  
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
  
    fetchServer();
    fetchChannels();
  }, [serverId]);
  

  const handleChannelCreated = (newChannel) => {
    setChannels((prev) => [...prev, newChannel]);
  };
  const textChannels = channels.filter((channel) => channel.type === "text");
  const voiceChannels = channels.filter((channel) => channel.type === "voice");
  
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

        <h1 className="text-xl font-bold mb-4">{server ? server.name : "Loading..."}</h1>


        <div className="relative">
            <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                onClick={(e) => {
                    const dropdown = e.currentTarget.nextSibling;
                    dropdown.classList.toggle("hidden");
                }}
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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

        
        {/* Display Text and Voice Channels */}
        <div className="mt-6">
          {/* Text Channels */}
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-2">Text Channels</h2>
            <ul className="space-y-2">
              {textChannels.map((channel) => (
                <li
                  key={channel._id}
                  className={`p-2 rounded-lg cursor-pointer border hover:bg-blue-100 ${
                    selectedChannel?._id === channel._id ? "bg-blue-100" : "bg-white"
                  }`}
                  onClick={() => setSelectedChannel(channel)}
                >
                  # {channel.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Voice Channels */}
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-2">Voice Channels</h2>
            <ul className="space-y-2">
              {voiceChannels.map((channel) => (
                <li
                  key={channel._id}
                  className={`p-2 rounded-lg cursor-pointer border flex items-center justify-between hover:bg-blue-100 ${
                    selectedChannel?._id === channel._id ? "bg-blue-100" : "bg-white"
                  }`}
                  onClick={() => setSelectedChannel(channel)}
                >
                  <span>🔊 {channel.name}</span>

                  {selectedChannel?._id === channel._id && (
                    <div className="space-x-2 ml-4">
                      {!isJoinVoiceCall ? (
                        <button
                          className="bg-blue-500 text-white rounded-lg px-3 py-1 hover:bg-blue-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsJoinVoiceCall(true);
                          }}
                        >
                          Join Call
                        </button>
                      ) : (
                        <button
                          className="bg-red-500 text-white rounded-lg px-3 py-1 hover:bg-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsJoinVoiceCall(false);
                          }}
                        >
                          End Call
                        </button>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Content Area for Selected Channel */}
        {selectedChannel ? (
          <div className="w-full">
            <h2 className="text-lg font-medium mb-4">
              {selectedChannel.type === "text"
                ? `Chat: ${selectedChannel.name}`
                : `Voice: ${selectedChannel.name}`}
            </h2>

            {/* Only handle voice logic here */}
            {selectedChannel.type === "voice" && (
              isJoinVoiceCall ? (
                <VoiceCall channelId={selectedChannel._id} userId={userId} />
              ) : (
                <div className="text-center text-gray-400">
                  <p>Click 'Join Call' to start the voice call</p>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="text-center text-gray-400">
            Select a channel to start chatting or calling
          </div>
        )}



      </div>

{/* Right Content Area */}
<div className="w-2/3 p-6 bg-white flex items-center justify-center">
  {selectedChannel ? (
    <div className="w-full">
      {selectedChannel.type === "text" ? (
        <>
          <h2 className="text-lg font-medium mb-4">Chat: {selectedChannel.name}</h2>
          <ChatInterface channelId={selectedChannel._id} userId={userId} />
        </>
      ) : (
        <div className="text-center text-gray-400">
          <p>Click 'Join Call' to start the voice call</p>
        </div>
      )}
    </div>
  ) : (
    <div className="text-center text-gray-400">
      <img
        src="https://cdn-icons-png.flaticon.com/512/9068/9068756.png"
        alt="No channel selected"
        className="w-48 mx-auto mb-4 opacity-70"
      />
      <p className="text-lg">Select a channel to start chatting or calling</p>
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
