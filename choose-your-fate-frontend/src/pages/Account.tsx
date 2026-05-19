import CharacterView from "../components/CharacterView/CharacterView";
import { useAuth } from "../context/AuthContext";

export default function Account() {
  const { token, logout } = useAuth();

  return (
    <div className="flow-root">
      <p>
        You are logged in {token ? "(token present)" : "(no token)"}
      </p>

      <button onClick={logout}>Logout</button>
      <CharacterView />
    </div>
  );
}