function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export default function HistoryTable({ checks, onDelete, showUser = false }) {
  if (!checks.length) {
    return <div className="table-empty">No checks found.</div>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Email</th>
            {showUser && <th>User</th>}
            <th>Risk</th>
            <th>Domain</th>
            <th>Temporary</th>
            <th>Checked</th>
            {onDelete && <th></th>}
          </tr>
        </thead>
        <tbody>
          {checks.map((check) => (
            <tr key={check._id}>
              <td>{check.email}</td>
              {showUser && <td>{check.user?.email || "Unknown"}</td>}
              <td>
                <span className={`pill ${check.riskLevel.toLowerCase()}`}>
                  {check.riskScore} / {check.riskLevel}
                </span>
              </td>
              <td>{check.domainExists ? "Exists" : "Missing"}</td>
              <td>{check.disposable ? "Yes" : "No"}</td>
              <td>{formatDate(check.createdAt)}</td>
              {onDelete && (
                <td>
                  <button className="text-button" onClick={() => onDelete(check._id)}>
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
