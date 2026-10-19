"use client";


import type { LucideIcon } from "lucide-react";

type ResourcePageProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  columns: string[];
  rows: string[][];
};

export default function ResourcePage({
  title,
  description,
  icon: Icon,
  columns,
  rows,
}: ResourcePageProps) {
  return (
    <main className="min-h-screen bg-slate-100 p-5 text-slate-900 md:p-8">
      <header className="mb-8">
        <p className="text-sm text-slate-500">
          CloudOps Manager / {title}
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-3 text-blue-700">
              <Icon size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => alert("Create form will be added in the next step.")}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Add {title === "Users" ? "User" : title === "Alerts" ? "Rule" : title === "Projects" ? "Project" : title === "Servers" ? "Server" : title === "Applications" ? "Application" : title === "Settings" ? "Setting" : "Item"}
          </button>
        </div>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">{title} overview</h2>
            <p className="mt-1 text-sm text-slate-500">
              {rows.length} sample records
            </p>
          </div>

          <input
            type="search"
            placeholder={`Search ${title.toLowerCase()}...`}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 sm:w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                {columns.map((column) => (
                  <th key={column} className="px-3 py-3 font-medium">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={`${title}-${index}`}
                  className="border-b border-slate-100 last:border-0"
                >
                  {row.map((value, cellIndex) => (
                    <td
                      key={`${title}-${index}-${cellIndex}`}
                      className="px-3 py-4"
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-3 py-8 text-center text-slate-500"
                  >
                    No records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-5 text-xs text-slate-500">
        CloudOps Manager · Prototype data only
      </p>
    </main>
  );
}
