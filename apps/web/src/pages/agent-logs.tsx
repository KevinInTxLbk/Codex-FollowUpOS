import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { DataTable } from "../components/DataTable";
import { apiFetch } from "../lib/apiFetch";

type AgentDecisionLog = {
  id: string;
  decision: string;
  reasoning: string;
  confidence: number;
  createdAt: string;
};

const AgentLogsPage = () => {
  const [logs, setLogs] = useState<AgentDecisionLog[]>([]);

  useEffect(() => {
    apiFetch<AgentDecisionLog[]>("/agent-decision-logs")
      .then((response) => setLogs(response.data))
      .catch((error) => console.error("Failed to load agent logs", error));
  }, []);

  return (
    <Layout title="Agent Logs">
      <section style={{ marginBottom: 16 }}>
        <h2>Agent Decisions</h2>
        <p style={{ color: "#475569" }}>
          Maintain a transparent audit trail of automated and human decisions.
        </p>
      </section>
      <DataTable
        data={logs}
        columns={[
          { header: "Decision", render: (log) => log.decision },
          { header: "Reasoning", render: (log) => log.reasoning },
          { header: "Confidence", render: (log) => `${Math.round(log.confidence * 100)}%` },
          {
            header: "Created",
            render: (log) => new Date(log.createdAt).toLocaleDateString(),
          },
        ]}
      />
    </Layout>
  );
};

export default AgentLogsPage;
