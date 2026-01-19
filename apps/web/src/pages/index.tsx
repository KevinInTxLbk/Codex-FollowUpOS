import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { apiFetch } from "../lib/apiFetch";

type Summary = {
  agencies: number;
  users: number;
  clients: number;
  leads: number;
  campaigns: number;
  outcomes: number;
  messages: number;
};

const OverviewPage = () => {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    const load = async () => {
      const [agencies, users, clients, leads, campaigns, outcomes, messages] = await Promise.all([
        apiFetch<unknown[]>("/agencies"),
        apiFetch<unknown[]>("/users"),
        apiFetch<unknown[]>("/clients"),
        apiFetch<unknown[]>("/leads"),
        apiFetch<unknown[]>("/campaigns"),
        apiFetch<unknown[]>("/outcomes"),
        apiFetch<unknown[]>("/messages"),
      ]);

      setSummary({
        agencies: agencies.data.length,
        users: users.data.length,
        clients: clients.data.length,
        leads: leads.data.length,
        campaigns: campaigns.data.length,
        outcomes: outcomes.data.length,
        messages: messages.data.length,
      });
    };

    load().catch((error) => {
      console.error("Failed to load summary", error);
    });
  }, []);

  return (
    <Layout title="Overview">
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 8 }}>Operations snapshot</h2>
        <p style={{ color: "#475569" }}>
          FollowUpOS keeps your agency, client, and lead activity aligned with deterministic local
          development and transparent execution.
        </p>
      </section>
      {summary ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
          }}
        >
          {Object.entries(summary).map(([key, value]) => (
            <div
              key={key}
              style={{
                padding: 16,
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                background: "#ffffff",
              }}
            >
              <p style={{ textTransform: "capitalize", color: "#64748b", margin: 0 }}>{key}</p>
              <p style={{ fontSize: 24, margin: "8px 0 0", fontWeight: 600 }}>{value}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading summary...</p>
      )}
    </Layout>
  );
};

export default OverviewPage;
