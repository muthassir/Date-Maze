import { useState } from "react";
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
      navigate("/"); // redirect to home after success
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
      <div className="flex justify-center items-center h-screen w-screen bg-base-200 flex-col log">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 border-2 border-error rounded-lg p-6">
          <legend className="fieldset-legend">
            {isLogin ? "Login" : "Register"}
          </legend>

          {/* Error Alert */}
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
              <label className="label">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="input"
                placeholder="Username"
              />
            </>
          )}

          <label className="label">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="input"
            placeholder="Email"
          />

          <label className="label">Password</label>
          <input
          
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="input"
            placeholder="Password"
          />

          <button
            className="btn btn-neutral mt-4 w-full"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <Loading />
            ) : isLogin ? (
              "Login"
            ) : (
              "Register"
            )}
          </button>
        </fieldset>

        <div className="w-xs flex justify-center items-center flex-col mt-4">
          <div className="divider divider-error">Or</div>
          <button
            className="btn btn-neutral mt-4 w-72"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
