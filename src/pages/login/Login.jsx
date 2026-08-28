import "./login.scss";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Login = () => {
  const { login } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    login();
  };

  return (
    <div className="login">
      <div className="card">

        {/* LEFT SIDE */}
        <div className="left">
          <h1>Welcome Back.</h1>

          <p>
            Connect with people, share your thoughts, and discover what is
            happening around you with SocialSphere.
          </p>

          <span>Don't have an account?</span>

          <Link to="/register">
            <button type="button">Register</button>
          </Link>
        </div>


        {/* RIGHT SIDE */}
        <div className="right">
          <h1>Login</h1>

          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              required
            />

            <input
              type="password"
              placeholder="Password"
              required
            />

            <button type="submit">
              Login
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;