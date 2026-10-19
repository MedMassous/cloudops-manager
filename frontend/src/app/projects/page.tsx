"use client";

import { FolderKanban } from "lucide-react";
import ResourcePage from "../../components/ResourcePage";


export default function ProjectsPage() {
  return (
    <ResourcePage
      title="Projects"
      description="Manage projects and their environments."
      icon={FolderKanban}
      columns={["Project", "Environment", "Team", "Status"]}
      rows={[
        ["Cloud Migration", "Production", "Platform Team", "Active"],
        ["Customer Portal", "Staging", "Web Team", "Active"],
        ["Monitoring Upgrade", "Development", "DevOps Team", "Planning"],
      ]}
    />
  );
}
