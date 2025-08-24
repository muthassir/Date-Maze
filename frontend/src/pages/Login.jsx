import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, loading, error, setError } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [hearts, setHearts] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success = false;

    if (isLogin) {
      const res = await login(form.email, form.password);
      if (res) success = true;
    } else {
      const res = await register(form.username, form.email, form.password);
      if (res) success = true;
    }

    if (success) {
      navigate("/");
    }
  };

  // Floating hearts
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
          >
            ❤️
          </span>
        ))}
      </div>

      {/* Glassmorphism Login/Register Form */}
      <div className="flex justify-center items-center h-screen w-screen flex-col relative z-10">
        <fieldset className="fieldset bg-white/20 border border-white/30 backdrop-blur-md shadow-xl rounded-2xl p-6 w-xs">
          <legend className="fieldset-legend text-lg font-bold text-white">
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
              <label className="label text-white">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Username"
              />
            </>
          )}

          <label className="label text-white">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Email"
          />

          <label className="label text-white">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Password"
          />

          <button
            className="w-full mt-4 px-6 py-2   btn btn-error transform hover:scale-105 transition-all duration-200"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <Loading /> : isLogin ? "Login" : "Register"}
          </button>
        </fieldset>

        <div className="w-xs flex justify-center items-center flex-col mt-4">
          <div className="divider divider-error text-white">Or</div>
          <button
            className="w-full mt-4 px-6 py-2   btn btn-error transform hover:scale-105 transition-all duration-200"
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
