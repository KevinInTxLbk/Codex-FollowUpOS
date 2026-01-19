import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { DataTable } from "../components/DataTable";
import { apiFetch } from "../lib/apiFetch";

type Message = {
  id: string;
  channel: string;
  status: string;
  subject?: string | null;
  body: string;
  createdAt: string;
};

const MessagesPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    apiFetch<Message[]>("/messages")
      .then((response) => setMessages(response.data))
      .catch((error) => console.error("Failed to load messages", error));
  }, []);

  return (
    <Layout title="Messages">
      <section style={{ marginBottom: 16 }}>
        <h2>Outbound Messaging</h2>
        <p style={{ color: "#475569" }}>
          View outbound message lifecycle status across SMS and email channels.
        </p>
      </section>
      <DataTable
        data={messages}
        columns={[
          { header: "Channel", render: (message) => message.channel },
          { header: "Status", render: (message) => message.status },
          { header: "Subject", render: (message) => message.subject ?? "—" },
          { header: "Body", render: (message) => message.body },
          {
            header: "Created",
            render: (message) => new Date(message.createdAt).toLocaleDateString(),
          },
        ]}
      />
    </Layout>
  );
};

export default MessagesPage;
