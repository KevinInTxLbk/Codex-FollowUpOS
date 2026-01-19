import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { DataTable } from "../components/DataTable";
import { apiFetch } from "../lib/apiFetch";

type Outcome = {
  id: string;
  name: string;
  status: string;
  createdAt: string;
};

const OutcomesPage = () => {
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);

  useEffect(() => {
    apiFetch<Outcome[]>("/outcomes")
      .then((response) => setOutcomes(response.data))
      .catch((error) => console.error("Failed to load outcomes", error));
  }, []);

  return (
    <Layout title="Outcomes">
      <section style={{ marginBottom: 16 }}>
        <h2>Outcome Tracking</h2>
        <p style={{ color: "#475569" }}>
          Monitor success targets and keep a clear audit trail for goal completion.
        </p>
      </section>
      <DataTable
        data={outcomes}
        columns={[
          { header: "Outcome", render: (outcome) => outcome.name },
          { header: "Status", render: (outcome) => outcome.status },
          {
            header: "Created",
            render: (outcome) => new Date(outcome.createdAt).toLocaleDateString(),
          },
        ]}
      />
    </Layout>
  );
};

export default OutcomesPage;
