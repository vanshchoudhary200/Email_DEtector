import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import HistoryTable from "../components/HistoryTable.jsx";

export default function History() {
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadHistory() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/emails/history");
      setChecks(data.checks);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load history");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    await api.delete(`/emails/history/${id}`);
    setChecks((items) => items.filter((item) => item._id !== id));
  }

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Saved scans</span>
          <h1>History Dashboard</h1>
        </div>
        <button className="secondary-button" onClick={loadHistory}>
          <RefreshCw size={17} /> Refresh
        </button>
      </div>
      {error && <div className="error">{error}</div>}
      {loading ? <div className="table-empty">Loading history...</div> : <HistoryTable checks={checks} onDelete={handleDelete} />}
    </section>
  );
}
