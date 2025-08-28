import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import logo1 from "../assets/logo1.jpg";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, loading, error, setError } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [hearts, setHearts] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Invalid email format");
      return;
    }
    if (!isLogin && !form.username) {
      setError("Username is required for registration");
      return;
    }
    if (form.password.length < 2) {
      setError("Password must be at least 6 characters");
      return;
    }

    let success = false;
    try {
      if (isLogin) {
        const res = await login(form.email, form.password);
        if (res) success = true;
      } else {
        const res = await register(form.username, form.email, form.password);
        if (res) success = true;
      }
      if (success) {
        setForm({ username: "", email: "", password: "" }); // Reset form
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.status === 400
          ? isLogin
            ? "Invalid email or password"
            : "Email already exists"
          : err.response?.data?.message ||
              `${isLogin ? "Login" : "Registration"} failed`
      );
    }
  };

  // Floating hearts (unchanged)
  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      setHearts((prev) => [
        ...prev,
        { id, left: Math.random() * 100, size: Math.random() * 20 + 10 },
      ]);
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== id));
      }, 6000);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-[1000] overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-300 via-rose-300 to-purple-200" />

      {/* Floating Hearts */}
      <div className="absolute inset-0 overflow-hidden">
        {hearts.map((heart) => (
          <span
            key={heart.id}
            className="absolute text-pink-200 opacity-80 animate-float-sway"
            style={{
              left: `${heart.left}%`,
              fontSize: `${heart.size}px`,
              bottom: "-20px",
            }}
            aria-hidden="true"
          >
            ❤️
          </span>
        ))}
      </div>

      {/* Glassmorphism Login/Register Form */}
      <div className="flex lg:justify-evenly justify-center items-center h-screen w-screen lg:flex-row flex-col relative z-10 gap-6">
              <img src={logo1} alt="logo" className="lg:h-46 h-26" />

        <fieldset className="fieldset bg-white/20 border border-white/30 backdrop-blur-md shadow-xl rounded-2xl p-6 w-xs">
          <legend className="fieldset-legend text-lg font-bold text-neutral">
            {isLogin ? "Login" : "Register"}
          </legend>

          {/* Error */}
          {error && (
            <div role="alert" className="alert alert-error my-2">
              <span>{error}</span>
              <button
                onClick={() => setError("")}
                className="btn btn-xs btn-ghost ml-auto"
              >
                ✕
              </button>
            </div>
          )}

          {!isLogin && (
            <>
              <label htmlFor="username" className="label text-neutral">
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="input input-bordered bg-white text-neutral w-full"
                placeholder="Username"
                aria-required="true"
              />
            </>
          )}

          <label htmlFor="email" className="label text-neutral">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="input input-bordered bg-white text-neutral w-full"
            placeholder="Email"
            aria-required="true"
          />

          <label htmlFor="password" className="label text-neutral">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="input input-bordered bg-white text-neutral w-full"
              placeholder="Password"
              aria-required="true"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="btn btn-xs btn-error absolute right-2 top-1/2 transform -translate-y-1/2"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            className="w-full mt-4 px-6 py-2 btn btn-error transform hover:scale-105 transition-all duration-200"
            onClick={handleSubmit}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? <Loading /> : isLogin ? "Login" : "Register"}
          </button>
        </fieldset>

        <div className="w-xs flex justify-center items-center flex-col mt-4">
          <div className="divider divider-error text-neutral">Or</div>
          <button
            className="w-full mt-4 px-6 py-2 btn btn-error transform hover:scale-105 transition-all duration-200"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes float-sway {
            0% { transform: translateY(0) translateX(0); opacity: 1; }
            50% { transform: translateY(-50vh) translateX(-20px); opacity: 0.7; }
            100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
          }
          .animate-float-sway {
            animation: float-sway 6s ease-in-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default Login;
