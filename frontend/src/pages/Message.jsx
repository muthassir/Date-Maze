import { useState, useEffect, useRef } from "react";
import { BiSolidSend } from "react-icons/bi";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import useOnlineStatus from "../components/useOnlineStatus";

const Message = () => {
  const { user, token, API } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const isOnline = useOnlineStatus();
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // ✅ Connect socket
  useEffect(() => {
    socketRef.current = io(API, { transports: ["websocket"] });
    socketRef.current.emit("join", user._id);

    socketRef.current.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (msg.receiver._id === user._id) {
        socketRef.current.emit("markSeen", { messageId: msg._id, receiverId: user._id });
      }
    });

    socketRef.current.on("messageSeen", (updatedMsg) => {
      setMessages((prev) => prev.map((m) => (m._id === updatedMsg._id ? updatedMsg : m)));
    });

    // ✅ Typing events
    socketRef.current.on("typing", ({ senderId }) => {
      if (senderId !== user._id) setPartnerTyping(true);
    });

    socketRef.current.on("stopTyping", ({ senderId }) => {
      if (senderId !== user._id) setPartnerTyping(false);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [user, API]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user?.partnerEmail) return;
      try {
        const res = await axios.get(`${API}/api/message`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);

        res.data.forEach((msg) => {
          if (msg.receiver._id === user._id && !msg.seen) {
            socketRef.current.emit("markSeen", { messageId: msg._id, receiverId: user._id });
          }
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [user?.partnerEmail, token, API]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !user?.partnerEmail) return;
    try {
      setLoading(true);
      const res = await axios.post(
        `${API}/api/message`,
        { text: input, receiverEmail: user.partnerEmail, isOnline },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => [...prev, res.data]);
      socketRef.current.emit("sendMessage", {
        ...res.data,
        receiver: res.data.receiver._id,
      });

      setInput("");
      socketRef.current.emit("stopTyping", { senderId: user._id, receiverId: res.data.receiver._id });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Typing handler
  const handleTyping = (e) => {
    setInput(e.target.value);

    if (!user?.partnerEmail) return;

    const receiverId = messages.find((m) => m.receiver.email === user.partnerEmail)?.receiver._id;
    if (!receiverId) return;

    socketRef.current.emit("typing", { senderId: user._id, receiverId });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit("stopTyping", { senderId: user._id, receiverId });
    }, 2000);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 p-6">
      <div className="mt-28 h-[450px] max-w-md bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-4 border border-pink-200 flex flex-col">
        <h1 className="text-2xl font-bold text-pink-600 text-center">Chat</h1>
        <p className="text-sm mt-1">{isOnline ? "🟢Online" : "🔴Offline"}</p>
        {partnerTyping && <p className="text-xs text-gray-500">Typing...</p>}

        <div className="divider"></div>

        {/* Messages */}
        <div className="h-[380px] overflow-y-auto flex-1 space-y-3 px-2">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.sender._id === user._id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[70%] shadow-md ${
                  msg.sender._id === user._id
                    ? "bg-pink-500 text-white rounded-br-none"
                    : "bg-pink-100 text-gray-800 rounded-bl-none"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] opacity-70">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {msg.sender._id === user._id && (
                    <p className="text-[10px] ml-2">
                      {msg.seen ? "✅✅" : "✅"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="divider"></div>

        {/* Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={handleTyping}
            className="border-2 border-pink-400 lg:w-full w-34 rounded-full px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-pink-300"
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading || !user?.partnerEmail}
          />
          <button
            onClick={handleSend}
            className="p-3 bg-error hover:bg-error text-white rounded-full shadow-lg disabled:opacity-50 transition"
            disabled={loading || !user?.partnerEmail}
          >
            {loading ? "..." : <BiSolidSend className="text-2xl" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Message;
