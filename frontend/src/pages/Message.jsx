import { useState, useEffect } from "react";
import { BiSolidSend } from "react-icons/bi";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const API = "http://localhost:5000";

const Message = () => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    if (!user?.partnerEmail) return;
    try {
      const res = await axios.get(`${API}/api/message`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [user?.partnerEmail]);

  const handleSend = async () => {
    if (!input.trim() || !user?.partnerEmail) return;
    try {
      setLoading(true);
      const res = await axios.post(
        `${API}/api/message`,
        { text: input, receiverEmail: user.partnerEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [...prev, res.data]);
      setInput("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-start flex-col gap-4">
      <h1 className="mt-8 text-xl font-semibold">Chat</h1>
      <div className="h-[480px] w-78 bg-base-100 shadow-xl rounded-lg p-6 border-2 border-error flex flex-col">
        <div className="divider">Messages</div>
        <div className="overflow-y-scroll h-[300px] flex-1">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`chat ${msg.sender._id === user._id ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-header">
                {msg.sender.username}
                <time className="text-xs opacity-50 ml-2">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
              <div className="chat-bubble">{msg.text}</div>
            </div>
          ))}
        </div>
        <div className="divider"></div>
        <div className="flex items-center justify-between gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border-error border-2 rounded-full input w-full"
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="btn btn-circle border-error hover:bg-error-focus"
          >
            {loading ? "..." : <BiSolidSend className="text-2xl text-error" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Message;
