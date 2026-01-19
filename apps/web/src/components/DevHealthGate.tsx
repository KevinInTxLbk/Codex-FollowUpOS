import { useEffect, useState } from "react";
import { apiFetch, ApiFetchError } from "../lib/apiFetch";

type HealthPayload = {
  service: string;
  port: number;
  expectedPort: number;
  expectedWebBaseUrl: string;
  nodeEnv: string;
};

export const DevHealthGate = () => {
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    let active = true;
    apiFetch<HealthPayload>("/health")
      .then((response) => {
        if (!active) return;
        setStatus("ok");
        setMessage(`Connected to ${response.data.service} on port ${response.data.port}.`);
      })
      .catch((error: unknown) => {
        if (!active) return;
        const err = error instanceof ApiFetchError ? error : new Error("Unknown error");
        setStatus("error");
        setMessage(`Health check failed: ${err.message}`);
      });

    return () => {
      active = false;
    };
  }, []);

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  if (status === "idle") {
    return (
      <div style={{ padding: "12px 32px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
        Checking API health...
      </div>
    );
  }

  const background = status === "ok" ? "#ecfeff" : "#fef2f2";
  const color = status === "ok" ? "#0e7490" : "#b91c1c";

  return (
    <div style={{ padding: "12px 32px", background, borderBottom: "1px solid #e2e8f0", color }}>
      {message}
    </div>
  );
};
