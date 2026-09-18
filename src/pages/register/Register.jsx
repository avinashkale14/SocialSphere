import "./register.scss";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input
  const handleChange = (e) => {
    setInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Register
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      await axios.post(
        "https://socialsphere-1b6c.onrender.com/api/auth/register",
        input
      );

      alert("User registered successfully!");

      navigate("/login");
    } catch (err) {
      console.log(
        "REGISTER ERROR:",
        err.response?.data || err.message
      );

      setError(
        typeof err.response?.data === "string"
          ? err.response.data
          : "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>SocialSphere.</h1>

          <p>
            Join SocialSphere and connect
            with people, share your thoughts,
            discover new ideas, and build
            meaningful connections.
          </p>

          <span>Already have an account?</span>

          <Link to="/login">
            <button type="button">
              Login
            </button>
          </Link>
        </div>

        <div className="right">
          <h1>Create Account</h1>

          <form onSubmit={handleRegister}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={input.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={input.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={input.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={input.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />

            {error && (
              <p className="error">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;