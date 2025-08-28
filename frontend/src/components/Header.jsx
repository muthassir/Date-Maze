import { Link } from "react-router-dom";
import Profile from "./Profile";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="navbar bg-white shadow-md px-6 fixed top-0 left-0 w-full z-50">
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
            className="menu menu-sm dropdown-content bg-white rounded-box z-50 mt-3 w-52 gap-4 p-2 shadow-lg border border-pink-200 text-black"
          >
            <Link to="/"><li className="hover:bg-pink-100 rounded">Dashboard</li></Link>
            <Link to="/alphabet"><li className="hover:bg-pink-100 rounded">Alphabet Date</li></Link>
            {user && <Link to="/message"><li className="hover:bg-pink-100 rounded">Message</li></Link> }
            <Link to="/quiz"><li className="hover:bg-pink-100 rounded">Quiz</li></Link>
            <Link to="/love-meter"><li className="hover:bg-pink-100 rounded">Love Meter</li></Link>
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
          Heartoz
        </Link>
      </div>

      {/* Navbar End */}
      <div className="navbar-end flex items-center gap-4">
        {user ? (
          <Profile />
        ) : (
          <Link
            to="/login"
            className="btn btn-error hover:scale-105 transform transition-all duration-200"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
