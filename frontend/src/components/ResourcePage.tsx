
"use client";

import { useState } from "react";
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
  const [search, setSearch] = useState("");
  const [records, setRecords] = useState(rows);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formValues, setFormValues] = useState<string[]>(
    columns.map(() => "")
  );

  const filteredRows = records
    .map((row, index) => ({ row, index }))
    .filter(({ row }) =>
      row.some((value) =>
        value.toLowerCase().includes(search.toLowerCase().trim())
      )
    );

  const addLabel =
    title === "Users"
      ? "User"
      : title === "Alerts"
        ? "Rule"
        : title === "Projects"
          ? "Project"
          : title === "Servers"
            ? "Server"
            : title === "Applications"
              ? "Application"
              : title === "Settings"
                ? "Setting"
                : "Item";

  function handleAddRecord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (formValues.some((value) => !value.trim())) {
      return;
    }

    setRecords((currentRecords) => [...currentRecords, [...formValues]]);
    setFormValues(columns.map(() => ""));
    setIsFormOpen(false);
  }

  function handleDeleteRecord(index: number) {
    if (!window.confirm(`Delete this ${addLabel.toLowerCase()}?`)) {
      return;
    }

    setRecords((currentRecords) =>
      currentRecords.filter((_, recordIndex) => recordIndex !== index)
    );
  }

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
            onClick={() => setIsFormOpen(true)}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Add {addLabel}
          </button>
        </div>
      </header>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={handleAddRecord}
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
          >
            <h2 className="mb-5 text-xl font-bold">Add {addLabel}</h2>

            <div className="space-y-4">
              {columns.map((column, index) => (
                <div key={column}>
                  <label className="mb-1 block text-sm font-medium">
                    {column}
                  </label>

                  <input
                    required
                    value={formValues[index]}
                    onChange={(event) => {
                      const nextValues = [...formValues];
                      nextValues[index] = event.target.value;
                      setFormValues(nextValues);
                    }}
                    placeholder={`Enter ${column.toLowerCase()}`}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Save {addLabel}
              </button>
            </div>
          </form>
        </div>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">{title} overview</h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredRows.length} of {records.length} records
            </p>
          </div>

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search ${title.toLowerCase()}...`}
            aria-label={`Search ${title.toLowerCase()}`}
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
                <th className="px-3 py-3 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRows.map(({ row, index }) => (
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

                  <td className="px-3 py-4">
                    <button
                      type="button"
                      onClick={() => handleDeleteRecord(index)}
                      className="rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredRows.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-3 py-8 text-center text-slate-500"
                  >
                    {records.length === 0
                      ? "No records yet."
                      : "No matching records found."}
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
