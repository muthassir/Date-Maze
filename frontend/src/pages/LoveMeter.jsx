import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import HeartScene from "../components/HeartScene";

const LoveMeter = () => {
  const { user } = useAuth();
  const [lovePoints, setLovePoints] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const monthKey = new Date().toLocaleString("default", { month: "long", year: "numeric" });
  const coupleKey = user ? `${user.username}❤️${user.coupleName || "Partner"}` : null;

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`leaderboard-${monthKey}`)) || [];
    setLeaderboard(saved);
    if (user && coupleKey) {
      const existing = saved.find(c => c.couple === coupleKey);
      if (existing) setLovePoints(existing.points);
    }
  }, [user, coupleKey, monthKey]);

  const handleClick = () => {
    if (!user || !coupleKey) return;

    const increment = Math.floor(Math.random() * 5) + 1;
    const newPoints = lovePoints + increment;
    setLovePoints(newPoints);
    setClicks(prev => prev + 1);

    let updated = JSON.parse(localStorage.getItem(`leaderboard-${monthKey}`)) || [];
    const idx = updated.findIndex(c => c.couple === coupleKey);

    if (idx >= 0) {
      updated[idx].points = newPoints;
    } else {
      updated.push({ couple: coupleKey, points: newPoints });
    }

    updated.sort((a, b) => b.points - a.points);
    updated = updated.slice(0, 10);

    localStorage.setItem(`leaderboard-${monthKey}`, JSON.stringify(updated));
    setLeaderboard(updated);
  };

  return (
    <div className="relative flex flex-col items-center justify-center gap-4 p-6 h-screen overflow-hidden bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400">
      {/* Floating Hearts Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <span
            key={i}
            className="absolute text-pink-500 opacity-70 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 24 + 16}px`,
              animationDuration: `${Math.random() * 5 + 5}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            ❤️
          </span>
        ))}
      </div>
    <HeartScene />
      {/* Glassmorphism Card */}
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl rounded-2xl p-8 w-[90%] max-w-md text-center relative z-10">
        <h2 className="text-3xl font-bold text-pink-700 drop-shadow">
          Love Meter 💖
        </h2>

        {user ? (
          <p className="text-lg font-semibold mt-3">
            {coupleKey}: {lovePoints} pts
          </p>
        ) : (
          <p className="text-gray-100 italic mt-3">
            Login to play and earn love points 💕
          </p>
        )}

        <p className="text-sm text-gray-200 mt-1">Clicks: {clicks}</p>

        {user ? (
          <button
            onClick={handleClick}
            className="mt-4 px-6 py-3 rounded-xl btn btn-error hover:bg-pink-600/80 text-white font-semibold shadow-lg backdrop-blur-md transition-transform transform hover:scale-105"
          >
            Click to Increase Love 💕
          </button>
        ) : null}

        <button
          onClick={() => setShowLeaderboard(true)}
          className="mt-4 px-6 py-3 rounded-xl btn btn-neutral text-pink-800 font-semibold shadow-lg backdrop-blur-md transition-transform transform hover:scale-105"
        >
          View Leaderboard 🏆
        </button>
      </div>

      {/* Leaderboard Modal with Glassmorphism */}
      {showLeaderboard && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20">
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-6 w-[350px] shadow-2xl">
            <h3 className="text-xl font-bold text-pink-700 mb-4 drop-shadow">
              Leaderboard – {monthKey}
            </h3>
            <ul className="space-y-3">
              {leaderboard.map((c, i) => {
                const isCurrentUser = coupleKey && c.couple === coupleKey;
                return (
                  <li
                    key={c.couple}
                    className={`flex justify-between p-3 rounded-xl backdrop-blur-md ${
                      isCurrentUser
                        ? "bg-pink-400/60 text-white font-bold"
                        : "bg-white/30 text-pink-900"
                    }`}
                  >
                    <span>
                      {i + 1}. {c.couple} {isCurrentUser && "❤️🔥💍"}
                    </span>
                    <span>{c.points} pts</span>
                  </li>
                );
              })}
              {leaderboard.length === 0 && (
                <p className="text-gray-200 italic text-center">
                  No couples yet this month 💔
                </p>
              )}
            </ul>
            <button
              onClick={() => setShowLeaderboard(false)}
              className="mt-6 w-full px-4 py-2 rounded-xl btn btn-error hover:bg-pink-600/80 text-white font-semibold shadow-lg backdrop-blur-md"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Custom Keyframes for Floating Hearts */}
      <style>
        {`
          @keyframes float {
            0% {
              transform: translateY(0) scale(1);
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: translateY(-200vh) scale(1.5);
              opacity: 0;
            }
          }
          .animate-float {
            animation-name: float;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
          }
        `}
      </style>
    </div>
  );
};

export default LoveMeter;
