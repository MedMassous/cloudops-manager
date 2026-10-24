
"use client";

import { useState } from "react";
import { Activity, BellRing, Layers, Settings } from "lucide-react";

export default function SettingsPage() {
  const [monitoring, setMonitoring] = useState(true);
  const [alerting, setAlerting] = useState(true);
  const [environment, setEnvironment] = useState("Development");

  return (
    <main className="min-h-screen bg-slate-100 p-5 text-slate-900 md:p-8">
      <header className="mb-8">
        <p className="text-sm text-slate-500">
          CloudOps Manager / Settings
        </p>

        <div className="mt-3 flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-3 text-blue-700">
            <Settings size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage application preferences and configuration.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">System preferences</h2>
          <p className="mt-1 text-sm text-slate-500">
            Configure monitoring and alerting preferences.
          </p>

          <div className="mt-5 divide-y divide-slate-100">
            <div className="flex items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                  <Activity size={21} />
                </div>
                <div>
                  <p className="font-medium">Monitoring</p>
                  <p className="text-sm text-slate-500">
                    Enable infrastructure metric collection.
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-label="Monitoring"
                aria-checked={monitoring}
                onClick={() => setMonitoring(!monitoring)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                  monitoring ? "bg-blue-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                    monitoring ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                  <BellRing size={21} />
                </div>
                <div>
                  <p className="font-medium">Alerting</p>
                  <p className="text-sm text-slate-500">
                    Enable threshold-based alert generation.
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-label="Alerting"
                aria-checked={alerting}
                onClick={() => setAlerting(!alerting)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                  alerting ? "bg-blue-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                    alerting ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-violet-50 p-2 text-violet-600">
              <Layers size={21} />
            </div>
            <div>
              <h2 className="font-semibold">Application environment</h2>
              <p className="mt-1 text-sm text-slate-500">
                Select the environment label for this prototype.
              </p>
            </div>
          </div>

          <label
            htmlFor="environment"
            className="mb-2 mt-5 block text-sm font-medium"
          >
            Environment
          </label>

          <select
            id="environment"
            value={environment}
            onChange={(event) => setEnvironment(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500 sm:max-w-sm"
          >
            <option value="Development">Development</option>
            <option value="Staging">Staging</option>
            <option value="Production">Production</option>
          </select>

          <p className="mt-3 text-xs text-slate-500">
            Prototype only. Changing this selection does not change the
            actual deployment environment.
          </p>
        </section>

        <p className="text-xs text-slate-500">
          CloudOps Manager · Settings are not saved to the backend yet.
        </p>
      </div>
    </main>
  );
}
