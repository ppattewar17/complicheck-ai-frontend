import React from "react";
import UploadForm from "./components/UploadForm";

function App() {
  return (
    <div style={styles.app}>
      <UploadForm />
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #eef2f3, #d9e4f5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Segoe UI, sans-serif",
  },
};

export default App;
