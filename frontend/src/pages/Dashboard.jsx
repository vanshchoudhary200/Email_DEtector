import { ScanSearch } from "lucide-react";
import { useState } from "react";
import { api } from "../api/client.js";
import ResultCard from "../components/ResultCard.jsx";

export default function Dashboard() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCheck(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/emails/check", { email });
      setResult(data.result);
    } catch (err) {
      setError(err.response?.data?.message || "Email check failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-grid">
      <section className="detector-panel">
        <span className="eyebrow">Email validation</span>
        <h1>Suspicious Email Detector</h1>
        <p>
          Validate email format, detect temporary providers, confirm domain mail readiness, and generate
          a risk score.
        </p>
        <form className="check-form" onSubmit={handleCheck}>
          <input
            type="text"
            inputMode="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="primary-button" disabled={loading}>
            <ScanSearch size={18} />
            {loading ? "Checking..." : "Check"}
          </button>
        </form>
        {error && <div className="error">{error}</div>}
      </section>

      <ResultCard result={result} />
    </div>
  );
}
