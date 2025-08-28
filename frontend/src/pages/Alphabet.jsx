import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Upload from "../components/Upload";
import Progress from "../components/Progress";
import Rating from "../components/Rating";
import Loading from "../components/Loading";
import bgImages from "../components/bgImages";
import { FaArrowLeft} from "react-icons/fa"
import { Link } from "react-router-dom";

const Alphabet = () => {
  const { user, loading, error, setError, API } = useAuth();

  // Letters A-Z
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Slogans for each letter
  const slogans = [
    "Aquarium","Beach","Cafe","Dancing",
    "Exercise","Forest","Gaming","Hiking","Ice Cream",
    "Jigsaw Puzzle","Karoke","Library","Museum","Netflix","Offroad",
    "Park","Quick Shower","River","Snow","Theatre","Umbrella with Rain",
    "Valentines","Waterfall","Xmas","Yard Game","Zoo",
  ];

  // progress calculation
  const totalLetter = 26;
  let completed = user?.photos?.length || 0;
  let value = Math.round((completed / totalLetter) * 100);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start 
      bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200
      relative overflow-hidden"
    >
      {/* Floating Hearts Background */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {[...Array(30)].map((_, i) => (
          <span
            key={i}
            className="absolute text-pink-400 opacity-60 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 25 + 20}px`,
              animationDuration: `${Math.random() * 15 + 10}s`,
            }}
          >
            ♥
          </span>
        ))}
      </div>

      {/* Floating Glass Container */}
      <div
        className="w-full max-w-6xl mt-24 p-6 rounded-3xl shadow-2xl
        bg-white/20 backdrop-blur-lg border border-white/30 
        flex flex-col items-center gap-6 z-10"
      >
        <Link to="/">
        < FaArrowLeft className="btn btn-error rounded-full h-12 w-12"/>
        </Link>
        
        <h1 className="text-3xl font-bold text-center text-error drop-shadow">
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

        {/* Progress */}
        <Progress value={value} completed={completed} />

        <div className="divider lg:hidden visible"></div>

        {/* Cards Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 mt-4 w-full">
          {letters.map((letter, index) => {
            const slogan = slogans[index];
            const existing = user?.photos?.find((p) => p.letter === letter);

            // only change: compute final image URL safely
            const imageUrl = existing
              ? (typeof existing.url === "string" && existing.url.startsWith("http")
                  ? existing.url
                  : `${API}${existing.url}`)
              : null;

            return (
              <div
                key={letter}
                className="flex flex-col justify-center items-center
                  rounded-2xl p-4 border border-white/30 shadow-lg
                  hover:shadow-2xl transform hover:-translate-y-1
                  transition-all duration-300 bg-cover bg-center
                  bg-white/10 backdrop-blur-md"
                style={{
                  backgroundImage: existing
                    ? `url(${imageUrl})`
                    : `url(${bgImages[index]})`,
                }}
              >
                {existing ? (
                  <ImageCard
                    letter={letter}
                    slogan={slogan}
                    url={imageUrl}
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <p className="mt-1 font-extrabold text-3xl text-error drop-shadow">
                      {letter}
                    </p>
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

      {/* Floating Animation CSS */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0) translateX(0); opacity: 0.7; }
            50% { transform: translateY(-50vh) translateX(20px); opacity: 0.4; }
            100% { transform: translateY(-100vh) translateX(-20px); opacity: 0; }
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

// Separate component to handle image loading fade-in
const ImageCard = ({ letter, slogan, url }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <p className="mt-1 font-extrabold text-3xl text-error drop-shadow">
        {letter}
      </p>
      <span className="text-sm mt-2 text-error italic">{slogan} Date</span>

      {!loaded && (
        <div className="w-32 h-32 flex items-center justify-center">
          <Loading />
        </div>
      )}

      <img
        src={url}
        onLoad={() => setLoaded(true)}
        className={`w-32 h-32 object-cover rounded-lg shadow-md mt-3 border-2 border-pink-300 transition-opacity duration-500 opacity-0`}
        alt={slogan}
      />
    </div>
  );
};

export default Alphabet;
