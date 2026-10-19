"use client";
import { Settings } from "lucide-react";
import ResourcePage from "@/components/ResourcePage";

export default function SettingsPage() {
  return (
    <ResourcePage
      title="Settings"
      description="Platform configuration overview."
      icon={Settings}
      columns={["Setting", "Value", "Description"]}
      rows={[
        ["Monitoring", "Enabled", "Metric collection status"],
        ["Alerting", "Enabled", "Threshold-based alerts"],
        ["Environment", "Development", "Current application environment"],
      ]}
    />
  );
}
