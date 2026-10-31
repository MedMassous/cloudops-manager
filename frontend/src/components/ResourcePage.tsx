
"use client";

import { useEffect, useState } from "react";
import { FolderKanban } from "lucide-react";
import { apiRequest } from "@/lib/api";

type Project = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

type ProjectsResponse = {
  data: Project[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  async function loadProjects() {
    try {
      setError("");
      const result = await apiRequest<ProjectsResponse>("/api/projects");
      setProjects(result.data);
    } catch {
      setError("Could not load projects. Please sign in again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function openAddForm() {
    setEditingId(null);
    setName("");
    setDescription("");
    setFormOpen(true);
  }

  function openEditForm(project: Project) {
    setEditingId(project.id);
    setName(project.name);
    setDescription(project.description || "");
    setFormOpen(true);
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const body = JSON.stringify({ name, description });

      if (editingId) {
        await apiRequest(`/api/projects/${editingId}`, {
          method: "PATCH",
          body,
        });
      } else {
        await apiRequest("/api/projects", {
          method: "POST",
          body,
        });
      }

      setFormOpen(false);
      setEditingId(null);
      await loadProjects();
    } catch {
      setError("Could not save project.");
    }
  }

  async function handleDelete(project: Project) {
    if (!window.confirm(`Delete ${project.name}?`)) return;

    try {
      await apiRequest(`/api/projects/${project.id}`, {
        method: "DELETE",
      });

      await loadProjects();
    } catch {
      setError("Could not delete project. Check your permissions.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-5 text-slate-900 md:p-8">
      <header className="mb-8">
        <p className="text-sm text-slate-500">
          CloudOps Manager / Projects
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-3 text-blue-700">
              <FolderKanban size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">Projects</h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage your infrastructure projects.
              </p>
            </div>
          </div>

          <button
            onClick={openAddForm}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Add Project
          </button>
        </div>
      </header>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={handleSave}
            className="w-full max-w-lg space-y-4 rounded-xl bg-white p-6 shadow-xl"
          >
            <h2 className="text-xl font-bold">
              {editingId ? "Edit Project" : "Add Project"}
            </h2>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Project name
              </label>
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                placeholder="Enter project name"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Description
              </label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                placeholder="Enter project description"
                rows={3}
              />
            </div>
[O
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Save Project
              </button>
            </div>
          </form>
        </div>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="font-semibold">Projects overview</h2>
          <p className="mt-1 text-sm text-slate-500">
            {projects.length} projects
          </p>
        </div>

        {loading ? (
          <p className="py-8 text-center text-slate-500">
            Loading projects...
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-3 py-3 font-medium">Project</th>
                  <th className="px-3 py-3 font-medium">Description</th>
                  <th className="px-3 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-3 py-4 font-medium">
                      {project.name}
                    </td>

                    <td className="px-3 py-4 text-slate-600">
                      {project.description || "—"}
                    </td>

                    <td className="whitespace-nowrap px-3 py-4">
                      <button
                        onClick={() => openEditForm(project)}
                        className="mr-2 rounded-md px-3 py-1.5 text-blue-600 hover:bg-blue-50"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(project)}
                        className="rounded-md px-3 py-1.5 text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {projects.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-3 py-8 text-center text-slate-500"
                    >
                      No projects yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="mt-5 text-xs text-slate-500">
        CloudOps Manager · Connected to backend API
      </p>
    </main>
  );
}

