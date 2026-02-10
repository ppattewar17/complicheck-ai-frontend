import React, { useState, useEffect } from "react";
import axios from "axios";
import ResultCard from "./ResultCard";
import ComplianceCharts from "./ComplianceCharts";
import LiveScan from "./LiveScan";

const UploadForm = () => {
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("food");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [liveMode, setLiveMode] = useState(false);

  // 🔥 Audit history
  const [history, setHistory] = useState([]);

  // Fetch audit history on load
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = () => {
    axios
      .get("http://localhost:5000/api/audit/history")
      .then((res) => setHistory(res.data))
      .catch((err) => console.error("History fetch error", err));
  };

  // Normal image upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please upload an image");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("category", category);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/check-compliance-ocr",
        formData
      );
      setResult(res.data);
      fetchHistory();
    } catch {
      alert("Compliance check failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>CompliCheck AI</h2>
      <p style={styles.subtitle}>
        AI-powered regulatory compliance checker
      </p>

      {/* 🔄 Upload OR Live Scan */}
      {liveMode ? (
        <LiveScan
          category={category}
          onResult={(data) => {
            setResult(data);
            setLiveMode(false);
            fetchHistory();
          }}
        />
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <select
              style={styles.select}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="food">Food</option>
              <option value="cosmetic">Cosmetic</option>
              <option value="electrical">Electrical</option>
            </select>

            <input
              type="file"
              accept="image/*"
              style={styles.file}
              onChange={(e) => setImage(e.target.files[0])}
            />

            <button style={styles.button} type="submit">
              {loading ? "Checking..." : "Check Compliance"}
            </button>
          </form>

          <button
            style={{ ...styles.button, background: "#059669", marginTop: 10 }}
            onClick={() => setLiveMode(true)}
          >
            📸 Scan with Camera
          </button>
        </>
      )}

      {/* Result */}
      {result && <ResultCard data={result} />}

      {/* Charts */}
      {history.length > 0 && <ComplianceCharts history={history} />}
    </div>
  );
};

const styles = {
  card: {
    width: 420,
    background: "#fff",
    padding: 25,
    borderRadius: 14,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  title: {
    margin: 0,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 13,
    color: "#777",
    marginBottom: 20,
  },
  select: {
    width: "100%",
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  file: {
    marginBottom: 12,
  },
  button: {
    width: "100%",
    padding: 12,
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 15,
  },
};

export default UploadForm;
