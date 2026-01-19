import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { apiFetch } from "../lib/apiFetch";
import { API_BASE_URL, WEB_BASE_URL } from "../lib/config";

type HealthPayload = {
  service: string;
  port: number;
  expectedPort: number;
  expectedWebBaseUrl: string;
  nodeEnv: string;
};

const DiagnosticsPage = () => {
  const [health, setHealth] = useState<HealthPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<HealthPayload>("/health")
      .then((response) => setHealth(response.data))
      .catch((err: Error) => {
        setError(err.message);
      });
  }, []);

  return (
    <Layout title="Diagnostics">
      <section style={{ marginBottom: 24 }}>
        <h2>Environment Diagnostics</h2>
        <p style={{ color: "#475569" }}>
          Confirm the API and web console are running on deterministic ports with expected base URLs.
        </p>
      </section>
      <div style={{ display: "grid", gap: 16, maxWidth: 640 }}>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>Local Configuration</h3>
          <p style={{ margin: "8px 0" }}>
            <strong>API Base URL:</strong> {API_BASE_URL}
          </p>
          <p style={{ margin: "8px 0" }}>
            <strong>Web Base URL:</strong> {WEB_BASE_URL}
          </p>
        </div>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>API Health</h3>
          {health ? (
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              <li>Service: {health.service}</li>
              <li>Port: {health.port}</li>
              <li>Expected port: {health.expectedPort}</li>
              <li>Expected web base URL: {health.expectedWebBaseUrl}</li>
              <li>Node environment: {health.nodeEnv}</li>
            </ul>
          ) : error ? (
            <p style={{ color: "#b91c1c" }}>Health error: {error}</p>
          ) : (
            <p>Loading health diagnostics...</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DiagnosticsPage;
