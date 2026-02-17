import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const ComplianceCharts = ({ history }) => {
  if (!history || history.length === 0) return null;

  // Bar chart – score trend
  const scoreData = {
    labels: history.map((_, i) => `Check ${i + 1}`),
    datasets: [
      {
        label: "Compliance Score",
        data: history.map((item) => item.score),
        backgroundColor: "#4f46e5",
      },
    ],
  };

  // Doughnut chart – status distribution
  const statusCount = history.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = {
    labels: Object.keys(statusCount),
    datasets: [
      {
        data: Object.values(statusCount),
        backgroundColor: ["#16a34a", "#f59e0b", "#dc2626"],
      },
    ],
  };

  return (
    <div style={styles.container}>
      <h3>Compliance Analytics</h3>

      <div style={styles.chartBox}>
        <Bar data={scoreData} />
      </div>

      <div style={styles.chartBox}>
        <Doughnut data={statusData} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginTop: 30,
  },
  chartBox: {
    marginBottom: 30,
    background: "#fff",
    padding: 15,
    borderRadius: 10,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
};

export default ComplianceCharts;
