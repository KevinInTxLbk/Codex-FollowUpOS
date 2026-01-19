import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { DataTable } from "../components/DataTable";
import { apiFetch } from "../lib/apiFetch";

type Lead = {
  id: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  status: string;
  createdAt: string;
};

const LeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    apiFetch<Lead[]>("/leads")
      .then((response) => setLeads(response.data))
      .catch((error) => console.error("Failed to load leads", error));
  }, []);

  return (
    <Layout title="Leads">
      <section style={{ marginBottom: 16 }}>
        <h2>Lead Pipeline</h2>
        <p style={{ color: "#475569" }}>
          Track outreach-ready contacts and keep the pipeline consistent across campaigns.
        </p>
      </section>
      <DataTable
        data={leads}
        columns={[
          { header: "Name", render: (lead) => lead.fullName },
          { header: "Email", render: (lead) => lead.email ?? "—" },
          { header: "Phone", render: (lead) => lead.phone ?? "—" },
          { header: "Status", render: (lead) => lead.status },
          {
            header: "Added",
            render: (lead) => new Date(lead.createdAt).toLocaleDateString(),
          },
        ]}
      />
    </Layout>
  );
};

export default LeadsPage;
