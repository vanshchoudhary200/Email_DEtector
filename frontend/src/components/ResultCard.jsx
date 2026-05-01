import { AlertTriangle, CheckCircle2, MailWarning } from "lucide-react";

function getTone(level) {
  if (level === "Critical" || level === "High") return "danger";
  if (level === "Medium") return "warning";
  return "safe";
}

export default function ResultCard({ result }) {
  if (!result) {
    return (
      <section className="empty-state">
        <MailWarning size={34} />
        <p>Run an email check to see risk score, DNS status, and suspicious signals.</p>
      </section>
    );
  }

  const tone = getTone(result.riskLevel);

  return (
    <section className={`result-panel ${tone}`}>
      <div className="result-top">
        <div>
          <span className="eyebrow">Analysis result</span>
          <h2>{result.email}</h2>
          <p>{result.domain}</p>
        </div>
        <div className="score-ring">
          <strong>{result.riskScore}</strong>
          <span>{result.riskLevel}</span>
        </div>
      </div>

      <div className="status-grid">
        <div>
          {result.syntaxValid ? <CheckCircle2 /> : <AlertTriangle />}
          <span>Syntax</span>
          <strong>{result.syntaxValid ? "Valid" : "Invalid"}</strong>
        </div>
        <div>
          {result.domainExists ? <CheckCircle2 /> : <AlertTriangle />}
          <span>Domain</span>
          <strong>{result.domainExists ? "Exists" : "Missing"}</strong>
        </div>
        <div>
          {result.hasMxRecords ? <CheckCircle2 /> : <AlertTriangle />}
          <span>MX Records</span>
          <strong>{result.hasMxRecords ? "Found" : "Not found"}</strong>
        </div>
        <div>
          {result.disposable ? <AlertTriangle /> : <CheckCircle2 />}
          <span>Temporary</span>
          <strong>{result.disposable ? "Detected" : "No"}</strong>
        </div>
      </div>

      <div className="reasons">
        <strong>Signals</strong>
        <ul>
          {result.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
