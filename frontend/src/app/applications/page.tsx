"use client";
import { Boxes } from "lucide-react";
import ResourcePage from "@/components/ResourcePage";

export default function ApplicationsPage() {
  return (
    <ResourcePage
      title="Applications"
      description="Manage deployed applications and versions."
      icon={Boxes}
      columns={["Application", "Version", "Environment", "Status"]}
      rows={[
        ["Customer Portal", "1.2.0", "Production", "Running"],
        ["API Service", "2.0.1", "Staging", "Running"],
        ["Worker Service", "1.0.0", "Development", "Stopped"],
      ]}
    />
  );
}
