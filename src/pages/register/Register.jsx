import "./register.scss";
import { Link } from "react-router-dom";

const Register = () => {
  const handleRegister = (e) => {
    e.preventDefault();

    // Backend registration will be added later
    console.log("Register submitted");
  };

  return (
    <div className="register">
      <div className="card">

        {/* LEFT SIDE */}
        <div className="left">
          <h1>SocialSphere.</h1>

          <p>
            Join SocialSphere and connect with people, share your thoughts,
            discover new ideas, and build meaningful connections.
          </p>

          <span>Already have an account?</span>

          <Link to="/login">
            <button type="button">Login</button>
          </Link>
        </div>


        {/* RIGHT SIDE */}
        <div className="right">
          <h1>Create Account</h1>

          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Username"
              required
            />

            <input
              type="email"
              placeholder="Email"
              required
            />

            <input
              type="password"
              placeholder="Password"
              required
            />

            <input
              type="text"
              placeholder="Full Name"
              required
            />

            <button type="submit">
              Register
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Register;