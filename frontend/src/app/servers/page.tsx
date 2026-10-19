"use client";
import { Server } from "lucide-react";
import ResourcePage from "@/components/ResourcePage";

export default function ServersPage() {
  return (
    <ResourcePage
      title="Servers"
      description="Manage cloud servers and virtual machines."
      icon={Server}
      columns={["Server", "IP Address", "Provider", "Status"]}
      rows={[
        ["web-server-01", "10.0.1.10", "AWS", "Online"],
        ["api-server-01", "10.0.1.20", "AWS", "Warning"],
        ["db-server-01", "10.0.1.30", "Local VM", "Online"],
      ]}
    />
  );
}
