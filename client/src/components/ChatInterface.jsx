import { useState, useEffect } from "react";
import {io} from "socket.io-client";

const socket = io("http://localhost:5000");

const ChatInterface = ({ channelId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Join the channel room
    socket.emit("joinChannel", channelId);

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

    // Listen for incoming messages
    
    socket.on("receiveMessage", async (message) => {
      if(!message.senderUsername){
        try {
          const res = await fetch(`/api/users/${message.sender}`);
          const userData = await res.json();
          if (res.ok) {
            message.senderUsername = userData.username;
          } else {
            message.senderUsername = "Unknown";
          }
          console.log("Fetched sender username:", message.senderUsername);
        } catch (err){
          console.error("Error fetching sender username:", err);
          message.senderUsername = "Unknown";
        }
      }

      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("receiveMessage");
    };
  }, [channelId]);

  const handleSendMessage = async () => {
    const messageData = {
      channelId,
      content: newMessage,
      sender: userId,
    };

    // Emit the message to the server
    socket.emit("sendMessage", messageData);

    // Optionally, save the message to the database 
    try {
      const res = await fetch(`/api/messages/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });

      if (res.ok) {
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="h-[90vh] flex flex-col border rounded-lg p-4 space-y-4">
      <div className="h-full overflow-y-auto border p-4">
        {messages.map((message) => (
          <div 
            key={message._id || message.timestamp} 
            className={`mb-2 flex ${
              message.sender === userId ? "justify-end" : "justify-start"
            }`}
            >
          <div
            className={`p-2 rounded-lg ${
              message.sender === userId
                ? "bg-blue-500 text-white text-right"
                : "bg-gray-200 text-black text-left"
            }`}
            style={{ maxWidth: "70%" }}
          >
            <p className="font-medium">
              {message.sender === userId ? "You" : message.senderUsername}
            </p>
            <p>{message.content}</p>
            </div>
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
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
        </svg>

        </button>
      </div>
    </div>
  );
};

export default ChatInterface;