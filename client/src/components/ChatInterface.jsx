import { useState, useEffect } from "react";

const ChatInterface = ({ channelId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Fetch messages for the channel
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages/channel/${channelId}`);
        const data = await res.json();
        if (res.ok) {
          setMessages(data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [channelId]);

  const handleSendMessage = async () => {
    try {
      const res = await fetch(`/api/messages/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId, content: newMessage, sender: userId }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prevMessages) => [...prevMessages, data]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="h-64 overflow-y-auto border p-4">
        {messages.map((message) => (
          <div key={message._id} className="mb-2">
            <p className="font-medium">{message.senderUsername}</p>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;