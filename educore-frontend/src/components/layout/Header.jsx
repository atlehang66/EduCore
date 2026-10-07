import { useAuth } from "../../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();

  const fullName = user
    ? `${user.first_name} ${user.last_name}`
    : "User";

  const role = user?.roles?.[0]?.name || "User";

  return (
    <header className="header">
      <div className="header-left">
        <h1>Dashboard</h1>
        <p>Welcome back to EduCore</p>
      </div>

      <div className="header-right">
        <div className="user-info">
          <strong>{fullName}</strong>
          <span>{role}</span>
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;