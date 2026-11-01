
"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Bell,
  Boxes,
  CircleAlert,
  FolderKanban,
  Server,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

type ProjectsResponse = {
  data: {
    id: string;
    name: string;
    description: string | null;
  }[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
};

type ServerStatus = "ONLINE" | "DEGRADED" | "OFFLINE" | "UNKNOWN";

type ServerRecord = {
  id: string;
  name: string;
  provider: string;
  region: string;
  hostname: string | null;
  ipAddress: string | null;
  operatingSystem: string | null;
  cpuCores: number;
  ramGb: number;
  storageGb: number;
  status: ServerStatus;
  environment: {
    name: string;
    type: string;
    project: {
      name: string;
    };
  };
};

type ServersResponse = {
  data: ServerRecord[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
};

const applications = [
  { name: "Web Portal", environment: "Production", status: "Running" },
  { name: "API Service", environment: "Production", status: "Running" },
  { name: "Background Worker", environment: "Staging", status: "Stopped" },
];

const monitoring = [
  { time: "09:00", cpu: 35, ram: 48 },
  { time: "10:00", cpu: 42, ram: 51 },
  { time: "11:00", cpu: 38, ram: 49 },
  { time: "12:00", cpu: 56, ram: 58 },
  { time: "13:00", cpu: 48, ram: 55 },
  { time: "14:00", cpu: 68, ram: 65 },
  { time: "15:00", cpu: 52, ram: 61 },
];

const statusConfig: Record<
  ServerStatus,
  { label: string; className: string }
> = {
  ONLINE: {
    label: "Online",
    className: "bg-emerald-100 text-emerald-700",
  },
  DEGRADED: {
    label: "Degraded",
    className: "bg-amber-100 text-amber-700",
  },
  OFFLINE: {
    label: "Offline",
    className: "bg-red-100 text-red-700",
  },
  UNKNOWN: {
    label: "Unknown",
    className: "bg-slate-100 text-slate-600",
  },
};

function ServerStatusBadge({ status }: { status: ServerStatus }) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}

function MonitoringChart() {
  const chartWidth = 600;
  const chartHeight = 190;
  const paddingX = 35;
  const paddingY = 15;

  function getPoints(key: "cpu" | "ram") {
    return monitoring
      .map((point, index) => {
        const x =
          paddingX +
          (index * (chartWidth - paddingX * 2)) / (monitoring.length - 1);

        const y =
          chartHeight -
          paddingY -
          (point[key] / 100) * (chartHeight - paddingY * 2);

        return `${x},${y}`;
      })
      .join(" ");
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4 text-xs">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
          CPU usage
        </span>

        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
          RAM usage
        </span>
      </div>

      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight + 25}`}
          className="w-full"
          role="img"
          aria-label="Illustrative CPU and RAM usage chart"
        >
          {[0, 25, 50, 75, 100].map((value) => {
            const y =
              chartHeight -
              paddingY -
              (value / 100) * (chartHeight - paddingY * 2);

            return (
              <g key={value}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                />

                <text
                  x={paddingX - 8}
                  y={y + 4}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="10"
                >
                  {value}%
                </text>
              </g>
            );
          })}

          <polyline
            points={getPoints("cpu")}
            fill="none"
            stroke="#2563eb"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <polyline
            points={getPoints("ram")}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {monitoring.map((point, index) => {
            const x =
              paddingX +
              (index * (chartWidth - paddingX * 2)) / (monitoring.length - 1);

            return (
              <text
                key={point.time}
                x={x}
                y={chartHeight + 18}
                fill="#64748b"
                fontSize="10"
                textAnchor="middle"
              >
                {point.time}
              </text>
            );
          })}
        </svg>
      </div>

      <p className="mt-3 text-xs text-slate-400">
        Illustrative data only · Not connected to live servers
      </p>
    </div>
  );
}

export default function Home() {
  const [projectCount, setProjectCount] = useState<number | null>(null);

  const [servers, setServers] = useState<ServerRecord[]>([]);
  const [serverCount, setServerCount] = useState<number | null>(null);
  const [serversLoading, setServersLoading] = useState(true);
  const [serversError, setServersError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const result = await apiRequest<ProjectsResponse>("/api/projects");
        setProjectCount(result.meta.total);
      } catch (error) {
        console.error("Could not load projects:", error);
      }
    }

    async function loadServers() {
      try {
        setServersLoading(true);
        setServersError(null);

        const result = await apiRequest<ServersResponse>(
          "/api/servers?limit=100"
        );

        setServers(result.data);
        setServerCount(result.meta.total);
      } catch (error) {
        console.error("Could not load servers:", error);
        setServersError("Could not load servers. Please try again.");
      } finally {
        setServersLoading(false);
      }
    }

    loadProjects();
    loadServers();
  }, []);

  const runningCount = applications.filter(
    (app) => app.status === "Running"
  ).length;

  const onlineCount = servers.filter(
    (server) => server.status === "ONLINE"
  ).length;

  const degradedCount = servers.filter(
    (server) => server.status === "DEGRADED"
  ).length;

  const offlineCount = servers.filter(
    (server) => server.status === "OFFLINE"
  ).length;

  const activeAlerts = degradedCount + offlineCount;

  const stats = [
    {
      label: "Total Projects",
      value: projectCount === null ? "—" : String(projectCount),
      detail: "Across all environments",
      icon: FolderKanban,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Total Servers",
      value: serverCount === null ? "—" : String(serverCount),
      detail: serversLoading
        ? "Loading server inventory"
        : `${servers.length} loaded from API`,
      icon: Server,
      color: "text-violet-600 bg-violet-50",
    },
    {
      label: "Applications",
      value: String(applications.length),
      detail: `${runningCount} currently running`,
      icon: Boxes,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Active Alerts",
      value: serversLoading ? "—" : String(activeAlerts),
      detail: serversError
        ? "Server status unavailable"
        : `${degradedCount} degraded · ${offlineCount} offline`,
      icon: CircleAlert,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="min-w-0 p-5 md:p-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">
              Workspace / Overview
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Dashboard
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Monitor your cloud infrastructure in one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/alerts"
              aria-label="View alerts"
              className="rounded-lg border border-slate-200 bg-white p-3 hover:bg-slate-50"
            >
              <Bell size={20} />
            </a>

            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-2 pr-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                A
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Administrator
                </p>
                <p className="text-xs text-slate-500">
                  Admin
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Statistics */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm text-slate-500">
                    {stat.label}
                  </p>

                  <div className={`rounded-lg p-2 ${stat.color}`}>
                    <Icon size={19} />
                  </div>
                </div>

                <p className="my-3 text-3xl font-bold">
                  {stat.value}
                </p>

                <p className="text-xs text-slate-500">
                  {stat.detail}
                </p>
              </article>
            );
          })}
        </div>

        {/* Monitoring */}
        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">
                Resource monitoring
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                CPU and RAM usage throughout the day
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
              Last 7 hours · Sample
            </span>
          </div>

          <MonitoringChart />
        </section>

        {/* Server Overview */}
        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">
                Server overview
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Real server inventory from your database
              </p>
            </div>

            <a
              href="/servers"
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View servers <ArrowUpRight size={16} />
            </a>
          </div>

          <div className="mb-4 flex flex-wrap gap-3 text-xs">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
              {onlineCount} Online
            </span>

            <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">
              {degradedCount} Degraded
            </span>

            <span className="rounded-full bg-red-100 px-3 py-1 text-red-700">
              {offlineCount} Offline
            </span>
          </div>

          {serversError && (
            <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {serversError}
            </p>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-3 py-3 font-medium">
                    Server
                  </th>

                  <th className="px-3 py-3 font-medium">
                    IP Address
                  </th>

                  <th className="px-3 py-3 font-medium">
                    Provider
                  </th>

                  <th className="px-3 py-3 font-medium">
                    Region
                  </th>

                  <th className="px-3 py-3 font-medium">
                    Resources
                  </th>

                  <th className="px-3 py-3 font-medium">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {serversLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 py-8 text-center text-slate-500"
                    >
                      Loading servers...
                    </td>
                  </tr>
                ) : serversError ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 py-8 text-center text-red-500"
                    >
                      Unable to display servers.
                    </td>
                  </tr>
                ) : servers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 py-8 text-center text-slate-500"
                    >
                      No servers registered yet.
                    </td>
                  </tr>
                ) : (
                  servers.map((server) => (
                    <tr
                      key={server.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-3 py-4">
                        <p className="font-medium">
                          {server.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {server.operatingSystem || server.hostname || "No extra details"}
                        </p>
                      </td>

                      <td className="px-3 py-4 text-slate-500">
                        {server.ipAddress || "—"}
                      </td>

                      <td className="px-3 py-4">
                        {server.provider}
                      </td>

                      <td className="px-3 py-4 text-slate-500">
                        {server.region}
                      </td>

                      <td className="px-3 py-4 text-slate-600">
                        <p>{server.cpuCores} vCPU</p>
                        <p>{server.ramGb} GB RAM</p>
                        <p>{server.storageGb} GB Storage</p>
                      </td>

                      <td className="px-3 py-4">
                        <ServerStatusBadge status={server.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!serversLoading && !serversError && serverCount !== null && (
            <p className="mt-4 text-xs text-slate-400">
              Showing {servers.length} of {serverCount} registered servers.
            </p>
          )}
        </section>

        {/* Quick Links */}
        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <a
            href="/projects"
            className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md"
          >
            <FolderKanban className="mb-3 text-blue-600" size={22} />

            <p className="font-semibold">Projects</p>

            <p className="mt-1 text-xs text-slate-500">
              Manage projects and teams
            </p>

            <ArrowUpRight
              className="mt-3 text-slate-400 group-hover:text-blue-600"
              size={17}
            />
          </a>

          <a
            href="/servers"
            className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md"
          >
            <Server className="mb-3 text-blue-600" size={22} />

            <p className="font-semibold">Servers</p>

            <p className="mt-1 text-xs text-slate-500">
              Review infrastructure resources
            </p>

            <ArrowUpRight
              className="mt-3 text-slate-400 group-hover:text-blue-600"
              size={17}
            />
          </a>

          <a
            href="/applications"
            className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md"
          >
            <Boxes className="mb-3 text-blue-600" size={22} />

            <p className="font-semibold">Applications</p>

            <p className="mt-1 text-xs text-slate-500">
              Check deployed applications
            </p>

            <ArrowUpRight
              className="mt-3 text-slate-400 group-hover:text-blue-600"
              size={17}
            />
          </a>

          <a
            href="/alerts"
            className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md"
          >
            <Bell className="mb-3 text-blue-600" size={22} />

            <p className="font-semibold">Alerts</p>

            <p className="mt-1 text-xs text-slate-500">
              Review infrastructure issues
            </p>

            <ArrowUpRight
              className="mt-3 text-slate-400 group-hover:text-blue-600"
              size={17}
            />
          </a>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <p>CloudOps Manager · Academic project</p>

          <p>
            Projects and servers connected to API · Other data is prototype
          </p>
        </footer>
      </section>
    </main>
  );
}
