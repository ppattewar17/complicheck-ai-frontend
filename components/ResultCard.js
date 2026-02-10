import React from "react";

const ResultCard = ({ data }) => {
  const statusColor =
    data.status === "APPROVED"
      ? "#16a34a"
      : data.status === "NEEDS_REVIEW"
      ? "#f59e0b"
      : "#dc2626";

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={{ ...styles.badge, background: statusColor }}>
          {data.status}
        </span>
        <span style={styles.score}>{data.score}%</span>
      </div>

      {/* Progress Bar */}
      <div style={styles.progress}>
        <div
          style={{
            ...styles.progressFill,
            width: `${data.score}%`,
            background: statusColor,
          }}
        />
      </div>

      <h4>Rule Breakdown</h4>

      <ul style={styles.list}>
        {Object.entries(data.breakdown).map(([rule, info]) => (
          <li key={rule} style={styles.ruleItem}>
            <strong>{rule}</strong>
            <span
              style={{
                color: info.status === "PASS" ? "#16a34a" : "#dc2626",
                fontWeight: 600,
              }}
            >
              {info.status}
            </span>

            {info.status === "FAIL" && (
              <div style={styles.reason}>
                ❌ {info.reason}
                <br />
                🛠️ {info.suggestion}
              </div>
            )}
          </li>
        ))}
      </ul>

      <details>
        <summary style={styles.summary}>View Extracted Text</summary>
        <p style={styles.text}>{data.extractedText}</p>
      </details>
    </div>
  );
};

const styles = {
  card: {
    marginTop: 20,
    padding: 15,
    background: "#f9fafb",
    borderRadius: 10,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    padding: "5px 10px",
    borderRadius: 20,
    color: "#fff",
    fontSize: 12,
  },
  score: {
    fontSize: 18,
    fontWeight: "bold",
  },
  progress: {
    height: 8,
    background: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
    margin: "10px 0",
  },
  progressFill: {
    height: "100%",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  ruleItem: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    marginBottom: 10,
    borderBottom: "1px solid #eee",
    paddingBottom: 6,
  },
  reason: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },
  summary: {
    cursor: "pointer",
    fontSize: 13,
    color: "#2563eb",
  },
  text: {
    fontSize: 12,
    whiteSpace: "pre-wrap",
    marginTop: 8,
  },
};

export default ResultCard;
