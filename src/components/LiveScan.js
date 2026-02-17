import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const LiveScan = ({ category, onResult }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const capturedRef = useRef(false);

  const [status, setStatus] = useState("Initializing camera...");

  useEffect(() => {
    startCamera();

    // 🕒 Capture 3 frames over 10 seconds
    const t1 = setTimeout(() => captureFrame(1), 3000);
    const t2 = setTimeout(() => captureFrame(2), 6000);
    const t3 = setTimeout(() => captureFrame(3), 9000);

    // 🧠 Process after 10 seconds
    const done = setTimeout(processFrames, 10000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(done);
      stopCamera();
    };
  }, []);

  /* ---------------- CAMERA ---------------- */

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });

    if (!videoRef.current) return;

    videoRef.current.srcObject = stream;
    videoRef.current.muted = true;
    videoRef.current.playsInline = true;
    videoRef.current.play().catch(() => {});

    setStatus("Hold label steady… Scanning 📸");
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    stream?.getTracks().forEach((t) => t.stop());
  };

  /* ---------------- FRAME CAPTURE ---------------- */

  const captureFrame = (index) => {
    if (capturedRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.videoWidth === 0) return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const sharpness = calculateSharpness(imgData);

    framesRef.current.push({
      dataUrl: canvas.toDataURL("image/jpeg", 0.9),
      sharpness,
    });

    setStatus(`Captured frame ${index}/3…`);
  };

  const calculateSharpness = (imgData) => {
    let sum = 0;
    for (let i = 0; i < imgData.data.length - 4; i += 4) {
      sum += Math.abs(imgData.data[i] - imgData.data[i + 4]);
    }
    return sum;
  };

  /* ---------------- PROCESS & SEND ---------------- */

  const processFrames = async () => {
    if (capturedRef.current) return;
    capturedRef.current = true;

    stopCamera();
    setStatus("Analyzing label…");

    let blob;

    // ✅ If frames exist → pick sharpest
    if (framesRef.current.length > 0) {
      const best = framesRef.current.sort(
        (a, b) => b.sharpness - a.sharpness
      )[0];

      blob = await fetch(best.dataUrl).then((r) => r.blob());
    } 
    // ✅ Fallback (very rare)
    else {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || video.videoWidth === 0) {
        setStatus("Camera error. Please retry.");
        return;
      }

      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.9)
      );
    }

    const formData = new FormData();
    formData.append("image", blob, "scan.jpg");
    formData.append("category", category);

    const res = await axios.post(
      "http://localhost:5000/api/check-compliance-ocr",
      formData
    );

    onResult(res.data);
  };

  /* ---------------- UI ---------------- */

  return (
    <div style={styles.container}>
      <video ref={videoRef} style={styles.video} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <p style={styles.status}>{status}</p>
    </div>
  );
};

const styles = {
  container: { textAlign: "center" },
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
