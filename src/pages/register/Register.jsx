import "./register.scss";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="register">
        <div className="card">
          <div className="left">
            <h1>Adii Social.</h1>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fuga adipisci facilis incidunt nostrum, necessitatibus nisi nam expedita fugiat illo veniam repellat animi ratione reprehenderit repudiandae enim voluptas, eaque voluptatum accusantium?
            </p>
            <span>Don't you have an account</span>
            <Link to="/login">
            <button>Login</button>
            </Link>
          </div>
          <div className="right">
            <h1>Register</h1>
            <form>
               <input type="text" placeholder="Username"/>
               <input type="email" placeholder="Email"/>
               <input type="Password" placeholder="Password"/>
               <input type="text" placeholder="Name"/>
               <button>
                Register
               </button>
            </form>
          </div >
        </div>
    </div>
  );
};

export default Register;