import { useState } from 'react';

const CreateChannel = ({ serverId, onChannelCreated }) => {
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState('text');
  const [message, setMessage] = useState('');

  const handleCreateChannel = async () => {
    try {
      const res = await fetch('/api/channels/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: channelName, type: channelType, server: serverId }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`Channel "${data.name}" created successfully!`);
        setChannelName('');
        setChannelType('text');
        if (onChannelCreated) onChannelCreated(data); // Notify parent component
      } else {
        setMessage(data.message || 'Failed to create channel');
      }
    } catch (error) {
      setMessage('An error occurred while creating the channel');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-700">Create a Channel</h2>
      <input
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={channelName}
        onChange={(e) => setChannelName(e.target.value)}
        placeholder="Channel Name"
      />
      <select
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={channelType}
        onChange={(e) => setChannelType(e.target.value)}
      >
        <option value="text">Text</option>
        <option value="voice">Voice</option>
      </select>
      <button
        onClick={handleCreateChannel}
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
      >
        Create Channel
      </button>
      {message && <p className="text-gray-600">{message}</p>}
    </div>
  );
};

export default CreateChannel;