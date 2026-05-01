import { LogOut, SearchCheck, Shield, TableProperties, UsersRound } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Layout() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Shield size={28} />
          <div>
            <strong>Email Guard</strong>
            <span>Suspicious Email Detector</span>
          </div>
        </div>

        <nav className="nav-list">
          <NavLink to="/" end>
            <SearchCheck size={18} /> Detector
          </NavLink>
          <NavLink to="/history">
            <TableProperties size={18} /> History
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin">
              <UsersRound size={18} /> Admin
            </NavLink>
          )}
        </nav>

        <div className="profile">
          <div>
            <strong>{user?.name}</strong>
            <span>{user?.email}</span>
          </div>
          <button className="icon-button" onClick={handleLogout} title="Log out">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
