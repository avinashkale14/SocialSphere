import "./login.scss";

import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import makeRequest from "../../axios";
import { AuthContext } from "../../context/authContext";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!inputs.username || !inputs.password) {
      setError(
        "Please enter username and password."
      );
      return;
    }

    try {
      setLoading(true);

      const res = await makeRequest.post(
        "/auth/login",
        inputs
      );

      console.log(
        "LOGIN RESPONSE:",
        res.data
      );

      login(res.data);

      navigate("/", {
        replace: true,
      });
    } catch (err) {
      console.log(
        "LOGIN ERROR:",
        err.response?.data ||
          err.message
      );

      setError(
        typeof err.response?.data === "string"
          ? err.response.data
          : "Login failed. Please check your username and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="card">

        {/* Left */}
        <div className="left">
          <h1>SocialSphere</h1>

          <p>
            Connect with friends, share moments,
            and discover new stories.
          </p>

          <span>
            Don't have an account?
          </span>

          <button
            type="button"
            onClick={() =>
              navigate("/register")
            }
          >
            Register
          </button>
        </div>

        {/* Right */}
        <div className="right">
          <h1>Login</h1>

          <form onSubmit={handleLogin}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={inputs.username}
              onChange={handleChange}
              autoComplete="username"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={inputs.password}
              onChange={handleChange}
              autoComplete="current-password"
            />

            {error && (
              <div className="error">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;