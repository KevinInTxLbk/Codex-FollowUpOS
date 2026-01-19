import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { DataTable } from "../components/DataTable";
import { apiFetch } from "../lib/apiFetch";

type Client = {
  id: string;
  name: string;
  industry: string;
  createdAt: string;
};

const ClientsPage = () => {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    apiFetch<Client[]>("/clients")
      .then((response) => setClients(response.data))
      .catch((error) => console.error("Failed to load clients", error));
  }, []);

  return (
    <Layout title="Clients">
      <section style={{ marginBottom: 16 }}>
        <h2>Client Accounts</h2>
        <p style={{ color: "#475569" }}>
          Maintain a consistent record of partner teams and their engagement footprint.
        </p>
      </section>
      <DataTable
        data={clients}
        columns={[
          { header: "Client", render: (client) => client.name },
          { header: "Industry", render: (client) => client.industry },
          {
            header: "Created",
            render: (client) => new Date(client.createdAt).toLocaleDateString(),
          },
        ]}
      />
    </Layout>
  );
};

export default ClientsPage;
