import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { login } from "../../api/authApi"
import "./login.css"

export default function Login() {
  const { updateToken } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = async () => {
    try {
      const data = await login(username, password);

      updateToken(data.token);

      navigate("/account");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="center-content">
      <div className="login-container">
        <h1>Login</h1>

        <input
          name="username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="button-placement">
          <button onClick={() => navigate("/register")}>
            Go to Register
          </button>
          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    </div>
  );
}