import React from "react";
import { useAuth } from "../context/AuthContext";
import Upload from "./Upload";
import Progress from "./Progress";
import Rating from "./Rating";
import Loading from "./Loading";

const Main = () => {
  const { user, loading, error, setError } = useAuth();
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const slogans = [
    "Aquarium",
    "Beach",
    "Cafe",
    "Dancing",
    "Exercise",
    "Forest",
    "Gaming",
    "Hiking",
    "Ice Cream",
    "Jungle",
    "Kite",
    "Lake",
    "Museum",
    "Netflix",
    "Ocean",
    "Picnic",
    "Quiz",
    "River",
    "Spa",
    "Theatre",
    "Umbrella",
    "Valentines",
    "Waterfall",
    "Xmas",
    "Yoga",
    "Zoo",
  ];
  const totalLetter = 26;
  let completed = user?.photos?.length || 0;
  let value = Math.round((completed / totalLetter) * 100);

  return (
    <div className="p-6 flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold mt-4 text-center text-error drop-shadow">
        {user
          ? `Welcome, ${user.username}!`
          : "Login To Keep Creating Beautiful Memories Together 💕"}
      </h1>

      {/* Error Alert */}
      {error && (
        <div
          role="alert"
          className="alert alert-error w-full max-w-xl my-2 shadow-lg rounded-lg"
        >
          <span className="font-semibold">{error}</span>
          <button
            onClick={() => setError("")}
            className="btn btn-xs btn-ghost ml-auto"
          >
            ✕
          </button>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center my-2">
          <Loading />
        </div>
      )}

      <Progress value={value} completed={completed} />

      <div className="divider lg:hidden visible"></div>

      {/* Cards Grid */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 mt-4 bg-gradient-to-r from-pink-100 to-pink-200 p-6 rounded-2xl shadow-lg">
        {letters.map((letter, index) => {
          const existing = user?.photos?.find((p) => p.letter === letter);
          const slogan = slogans[index];

          return (
            <div
              key={letter}
              className="flex flex-col justify-center items-center bg-white rounded-2xl p-4 border border-pink-200
                         shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              {existing ? (
                <div className="flex flex-col items-center">
                  <p className="mt-1 font-extrabold text-3xl text-pink-600 drop-shadow">
                    {letter}
                  </p>
                  <span className="text-sm mt-2 text-gray-700 italic">{slogan} Date</span>
                  <img
                    src={
                      existing
                        ? `http://localhost:5000${existing.url}`
                        : "https://img.daisyui.com/images/profile/demo/spiderperson@192.webp"
                    }
                    alt={letter}
                    className="w-32 h-32 object-cover rounded-lg shadow-md mt-3 border-2 border-pink-300"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <p className="font-extrabold text-3xl text-gray-500 mb-2">{letter}</p>
                  <Upload letter={letter} slogan={slogan} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="divider my-6"></div>
      <Rating />
    </div>
  );
};

export default Main;
