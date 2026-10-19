"use client";
import { Users } from "lucide-react";
import ResourcePage from "@/components/ResourcePage";

export default function UsersPage() {
  return (
    <ResourcePage
      title="Users"
      description="Manage platform users and their access."
      icon={Users}
      columns={["Name", "Email", "Role", "Status"]}
      rows={[
        ["Administrator", "admin@example.com", "Admin", "Active"],
        ["DevOps User", "devops@example.com", "DevOps", "Active"],
        ["Read Only User", "viewer@example.com", "Viewer", "Active"],
      ]}
    />
  );
}
