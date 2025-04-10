import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CreateChannel from "../components/CreateChannel";

const ServerDashboard = () => {
  const { serverId } = useParams(); // Get serverId from the URL
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);

  useEffect(() => {
    // Fetch channels for the server
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
    setChannels((prevChannels) => [...prevChannels, newChannel]);
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Server Dashboard</h1>
      <CreateChannel serverId={serverId} onChannelCreated={handleChannelCreated} />
      <div>
        <h2 className="text-lg font-medium">Channels</h2>
        <ul className="space-y-2">
          {channels.map((channel) => (
            <li
              key={channel._id}
              className={`p-2 border rounded-lg cursor-pointer ${
                selectedChannel?._id === channel._id ? "bg-blue-100" : ""
              }`}
              onClick={() => setSelectedChannel(channel)}
            >
              {channel.name} ({channel.type})
            </li>
          ))}
        </ul>
      </div>
      {selectedChannel && (
        <div className="mt-6">
          <h2 className="text-lg font-medium">Chat: {selectedChannel.name}</h2>
          {/* Add ChatInterface component here */}
        </div>
      )}
    </div>
  );
};

export default ServerDashboard;