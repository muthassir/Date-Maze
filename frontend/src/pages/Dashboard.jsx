import React from "react";
import { Link } from "react-router-dom";
import Rating from "../components/Rating";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
      const lists = [{link: "/alphabet", title: "Alphabet Dates"},
                    {link: "/message", title: "Message"},
                    {link: "/quiz", title: "Quizz"},
                    {link: "/love-meter", title: "Love Meter"},
                    {link: "/tictactoe", title: "Tic-Tac-Toe"},
                    {link: "/planner", title: "Planner"},
                    {link: "/gallery", title: "Gallery"},
                    // {link: "/", title: ""},

      ]

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

      {/* content */}
      <div
        className="lg:w-2/3 mt-38 p-6 rounded-3xl shadow-2xl
        bg-white/20 backdrop-blur-lg border border-white/30 
        flex flex-col items-center gap-6 z-10 mb-2  "
      >
        <h1 className="text-error">Dashboard</h1>
         <h1 className="text-3xl font-bold text-center text-error drop-shadow">
          {user
            ? `Welcome, ${user.username}!`
            : "Login To Keep Creating Beautiful Memories Together 💕"}
        </h1>
      <div className="divider"></div>
      
        <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-6 ">
             {lists.map((data)=>{
          return  <Link to={data.link} key={data.title}>
            <div
              className="flex flex-col justify-center items-center
                  rounded-2xl p-4 border border-white/30 shadow-lg
                  hover:shadow-2xl transform hover:-translate-y-1
                  transition-all duration-300 bg-cover bg-center
                  bg-error backdrop-blur-md h-34 w-34 text-center "
            >
              <h1>{data.title}</h1>
            </div>
          </Link>
        })}
        </div>
      </div>

      <Rating />

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

export default Dashboard;
