// import { useState } from "react";
// import Profile from "./Profile";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import Loading from "./Loading";

// const Header = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(false);

//   const handleLoginClick = async () => {
//     try {
//       setLoading(true);
//       navigate("/login");
//     } catch (err) {
//       alert("Something went wrong while navigating.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <header className="navbar bg-base-100 shadow-md px-6">
//       {/* Navbar Start */}
//       <div className="navbar-start">
//         <div className="dropdown">
//           <div
//             tabIndex={0}
//             role="button"
//             className="btn btn-error btn-circle hover:bg-pink-100 transition-colors duration-200"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 text-neutral"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M4 6h16M4 12h16M4 18h7"
//               />
//             </svg>
//           </div>
//           <ul
//             tabIndex={0}
//             className="menu menu-sm dropdown-content bg-white rounded-box z-50 mt-3 w-52 h-32 gap-4 p-2 shadow-lg border border-pink-200 text-black"
//           >
//             <Link to="/"><li className="hover:bg-pink-100 rounded">Homepage</li></Link>
//             <Link to="/contact"><li className="hover:bg-pink-100 rounded">Contact</li></Link>
//             <Link to="/about"><li className="hover:bg-pink-100 rounded">About</li></Link>
//           </ul>
//         </div>
//       </div>

//       {/* Navbar Center */}
//       <div className="navbar-center">
//         <Link to="/" className="btn btn-ghost text-2xl font-bold text-error hover:scale-105 transform transition-all duration-200">
//           Date Maze
//         </Link>
//       </div>

//       {/* Navbar End */}
//       <div className="navbar-end">
//         {user ? (
//           <Profile />
//         ) : (
//           <button
//             className="btn btn-error hover:scale-105 transform transition-all duration-200"
//             onClick={handleLoginClick}
//             disabled={loading}
//           >
//             {loading ? (
//               <Loading />
//             ) : (
//               "Login"
//             )}
//           </button>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;











import { useState } from "react";
import Profile from "./Profile";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLoginClick = async () => {
    try {
      setLoading(true);
      navigate("/login");
    } catch (err) {
      alert("Something went wrong while navigating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="navbar bg-base-100 shadow-md px-6">
      {/* Navbar Start */}
      <div className="navbar-start">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-error btn-circle hover:bg-pink-100 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-neutral"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-white rounded-box z-50 mt-3 w-52  gap-4 p-2 shadow-lg border border-pink-200 text-black"
          >
            <Link to="/"><li className="hover:bg-pink-100 rounded">Homepage</li></Link>
            <Link to="/message"><li className="hover:bg-pink-100 rounded">Message</li></Link>
            <Link to="/quiz"><li className="hover:bg-pink-100 rounded">Quiz</li></Link>
            <Link to="/about"><li className="hover:bg-pink-100 rounded">About</li></Link>
            <Link to="/contact"><li className="hover:bg-pink-100 rounded">Contact</li></Link>
          </ul>
        </div>
      </div>

      {/* Navbar Center */}
      <div className="navbar-center">
        <Link
          to="/"
          className="btn btn-ghost text-2xl font-bold text-error hover:scale-105 transform transition-all duration-200"
        >
          Date Maze
        </Link>
      </div>

      {/* Navbar End */}
      <div className="navbar-end flex items-center gap-4">
       
        {user ? (
          <Profile />
        ) : (
          <button
            className="btn btn-error hover:scale-105 transform transition-all duration-200"
            onClick={handleLoginClick}
            disabled={loading}
          >
            {loading ? <Loading /> : "Login"}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;

