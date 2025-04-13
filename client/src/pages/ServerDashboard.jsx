import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CreateChannel from "../components/CreateChannel";
import ChatInterface from "../components/ChatInterface";

const ServerDashboard = ({userId}) => {
  const { serverId } = useParams();
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);

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
          ← Back
        </button>

        <h1 className="text-xl font-bold mb-4">Server Dashboard</h1>

        <CreateChannel serverId={serverId} onChannelCreated={handleChannelCreated} />

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
    </div>
  );
};

export default ServerDashboard;
