import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ServerList = () => {
  const [servers, setServers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const res = await fetch('/api/servers'); // Adjust the API endpoint if needed
        const data = await res.json();
        if (res.ok) {
          setServers(data);
        } else {
          console.error('Failed to fetch servers');
        }
      } catch (error) {
        console.error('Error fetching servers:', error);
      }
    };

    fetchServers();
  }, []);

  const handleServerClick = (serverId) => {
    navigate(`/server/${serverId}`);
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-4 space-y-4">
      <h2 className="text-lg font-semibold mb-4">Your Servers</h2>
      {servers.length === 0 ? (
        <p className="text-gray-400">No servers joined.</p>
      ) : (
        servers.map((server) => (
          <div
            key={server._id}
            className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer"
            onClick={() => handleServerClick(server._id)}
          >
            {server.name}
          </div>
        ))
      )}
    </div>
  );
};

export default ServerList;
