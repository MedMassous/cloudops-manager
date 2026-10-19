"use client";
import { Activity } from "lucide-react";
import ResourcePage from "@/components/ResourcePage";

export default function MonitoringPage() {
  return (
    <ResourcePage
      title="Monitoring"
      description="Review infrastructure metrics and availability."
      icon={Activity}
      columns={["Server", "CPU", "RAM", "Availability"]}
      rows={[
        ["web-server-01", "32%", "54%", "99.9%"],
        ["api-server-01", "78%", "82%", "99.5%"],
        ["db-server-01", "24%", "46%", "100%"],
      ]}
    />
  );
}
