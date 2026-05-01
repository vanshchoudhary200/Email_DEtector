import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import HistoryTable from "../components/HistoryTable.jsx";

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [checks, setChecks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadAdmin() {
    setLoading(true);
    setError("");
    try {
      const [statsRes, usersRes, checksRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users"),
        api.get("/admin/checks")
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setChecks(checksRes.data.checks);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load admin data");
    } finally {
      setLoading(false);
    }
  }

  async function changeRole(id, role) {
    const { data } = await api.patch(`/admin/users/${id}/role`, { role });
    setUsers((items) => items.map((item) => (item._id === id ? data.user : item)));
  }

  useEffect(() => {
    loadAdmin();
  }, []);

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Role protected</span>
          <h1>Admin Panel</h1>
        </div>
        <button className="secondary-button" onClick={loadAdmin}>
          <RefreshCw size={17} /> Refresh
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && <div className="table-empty">Loading admin data...</div>}

      {stats && (
        <div className="stats-grid">
          <div><span>Users</span><strong>{stats.users}</strong></div>
          <div><span>Checks</span><strong>{stats.checks}</strong></div>
          <div><span>High Risk</span><strong>{stats.high}</strong></div>
          <div><span>Critical</span><strong>{stats.critical}</strong></div>
          <div><span>Temporary</span><strong>{stats.disposable}</strong></div>
        </div>
      )}

      <div className="split">
        <section>
          <h2>Users</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <select value={user.role} onChange={(e) => changeRole(user._id, e.target.value)}>
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>All Checks</h2>
          <HistoryTable checks={checks} showUser />
        </section>
      </div>
    </section>
  );
}
