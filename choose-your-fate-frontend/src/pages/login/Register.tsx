import React from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../api/authApi"
import "./login.css"

export default function Register() {
    const navigate = useNavigate();
  
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleRegister = async () => {
      try {
        const data = await register(username, email, password);
        
        navigate("/");
      } catch (err) {
        console.error(err);
        alert("Login failed");
      }
    };
  
    return (
      <div className="center-content">
        <div className="login-container">
          <h1>Register</h1>
  
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />

          <input
            name="email"
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
  
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
  
          <div className="button-placement">
            <button onClick={() => navigate("/")}>
              Go to login
            </button>
            <button onClick={handleRegister}>Register new account</button>
          </div>
        </div>
      </div>
    );
}