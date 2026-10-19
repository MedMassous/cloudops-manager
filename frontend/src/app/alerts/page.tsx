"use client";
import { Bell } from "lucide-react";
import ResourcePage from "@/components/ResourcePage";

export default function AlertsPage() {
  return (
    <ResourcePage
      title="Alerts"
      description="Review incidents and infrastructure warnings."
      icon={Bell}
      columns={["Incident", "Server", "Severity", "Status"]}
      rows={[
        ["High CPU usage", "api-server-01", "Warning", "Active"],
        ["Server unavailable", "worker-server-01", "Critical", "Open"],
      ]}
    />
  );
}
