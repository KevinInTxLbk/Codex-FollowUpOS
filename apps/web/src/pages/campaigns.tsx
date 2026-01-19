import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { DataTable } from "../components/DataTable";
import { apiFetch } from "../lib/apiFetch";

type Campaign = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    apiFetch<Campaign[]>("/campaigns")
      .then((response) => setCampaigns(response.data))
      .catch((error) => console.error("Failed to load campaigns", error));
  }, []);

  return (
    <Layout title="Campaigns">
      <section style={{ marginBottom: 16 }}>
        <h2>Campaign Playbooks</h2>
        <p style={{ color: "#475569" }}>
          Align messaging sequences with outcomes and keep stakeholders informed.
        </p>
      </section>
      <DataTable
        data={campaigns}
        columns={[
          { header: "Campaign", render: (campaign) => campaign.name },
          { header: "Description", render: (campaign) => campaign.description },
          {
            header: "Created",
            render: (campaign) => new Date(campaign.createdAt).toLocaleDateString(),
          },
        ]}
      />
    </Layout>
  );
};

export default CampaignsPage;
