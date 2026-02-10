import React, { useEffect, useRef, useState } from "react";
import Tesseract from "tesseract.js";
import axios from "axios";

const LiveScan = ({ category, onResult }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState("Initializing camera...");
  const [scanning, setScanning] = useState(true);
  const lastTextRef = useRef("");

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    videoRef.current.srcObject = stream;
    videoRef.current.play();
    setStatus("Scanning label...");
    scanLoop();
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    stream?.getTracks().forEach((t) => t.stop());
  };

  const scanLoop = async () => {
    if (!scanning) return;

    captureFrame();

    setTimeout(scanLoop, 1500); // scan every 1.5 sec
  };

  const captureFrame = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const { data } = await Tesseract.recognize(canvas, "eng");

    const text = data.text.trim();

    if (
      text.length > 50 &&
      text === lastTextRef.current
    ) {
      setStatus("Label detected ✔️ Checking compliance...");
      setScanning(false);
      stopCamera();
      sendToBackend(canvas);
    }

    lastTextRef.current = text;
  };

  const sendToBackend = async (canvas) => {
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("image", blob, "scan.jpg");
      formData.append("category", category);

      const res = await axios.post(
        "http://localhost:5000/api/check-compliance-ocr",
        formData
      );

      onResult(res.data);
    });
  };

  return (
    <div style={styles.container}>
      <video ref={videoRef} style={styles.video} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <p style={styles.status}>{status}</p>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
  },
  video: {
    width: "100%",
    borderRadius: 12,
    border: "2px solid #4f46e5",
  },
  status: {
    marginTop: 10,
    fontSize: 14,
    color: "#555",
  },
};

export default LiveScan;
