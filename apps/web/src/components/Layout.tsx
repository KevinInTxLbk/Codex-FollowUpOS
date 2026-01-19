import Link from "next/link";
import { ReactNode } from "react";
import { DevHealthGate } from "./DevHealthGate";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/leads", label: "Leads" },
  { href: "/clients", label: "Clients" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/outcomes", label: "Outcomes" },
  { href: "/messages", label: "Messages" },
  { href: "/agent-logs", label: "Agent Logs" },
  { href: "/diagnostics", label: "Diagnostics" },
];

type LayoutProps = {
  children: ReactNode;
  title: string;
};

export const Layout = ({ children, title }: LayoutProps) => {
  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", color: "#0f172a" }}>
      <header
        style={{
          padding: "24px 32px",
          borderBottom: "1px solid #e2e8f0",
          background: "#ffffff",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 12, textTransform: "uppercase", color: "#64748b", margin: 0 }}>
              FollowUpOS
            </p>
            <h1 style={{ margin: "4px 0 0", fontSize: 20 }}>{title}</h1>
          </div>
          <nav style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} style={{ color: "#2563eb", textDecoration: "none", fontSize: 14 }}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <DevHealthGate />
      <main style={{ padding: "32px" }}>{children}</main>
    </div>
  );
};
