
import {
  Activity,
  ArrowUpRight,
  Bell,
  Boxes,
  CircleAlert,
  FolderKanban,
  LayoutDashboard,
  Server,
} from "lucide-react";

const servers = [
  { name: "web-server-01", ip: "10.0.1.10", cpu: 32, ram: 54, status: "Online" },
  { name: "api-server-01", ip: "10.0.1.20", cpu: 78, ram: 82, status: "Warning" },
  { name: "db-server-01", ip: "10.0.1.30", cpu: 24, ram: 46, status: "Online" },
  { name: "worker-server-01", ip: "10.0.1.40", cpu: 0, ram: 0, status: "Offline" },
];

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

const onlineCount = servers.filter((server) => server.status === "Online").length;
const warningCount = servers.filter((server) => server.status === "Warning").length;
const offlineCount = servers.filter((server) => server.status === "Offline").length;
const runningCount = applications.filter((app) => app.status === "Running").length;

const stats = [
  {
    label: "Total Projects",
    value: "12",
    detail: "Across all environments",
    icon: FolderKanban,
    color: "text-blue-600 bg-blue-50",
  },
  {
    label: "Total Servers",
    value: String(servers.length),
    detail: `${offlineCount} server offline`,
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
    value: String(warningCount + offlineCount),
    detail: `${warningCount} warning · ${offlineCount} offline`,
    icon: CircleAlert,
    color: "text-amber-600 bg-amber-50",
  },
];

function MetricBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const color =
    value >= 80
      ? "bg-red-500"
      : value >= 70
        ? "bg-amber-500"
        : "bg-blue-600";

  return (
    <div className="min-w-24">
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-slate-500">{label}</span>
        <span className="font-medium text-slate-700">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
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
          aria-label="Sample CPU and RAM usage over seven hours"
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
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="min-w-0 p-5 md:p-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Workspace / Overview</p>
            <h2 className="mt-1 text-2xl font-bold">Dashboard</h2>
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
                <p className="text-sm font-semibold">Administrator</p>
                <p className="text-xs text-slate-500">Admin</p>
              </div>
            </div>
          </div>
        </header>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <div className={`rounded-lg p-2 ${stat.color}`}>
                    <Icon size={19} />
                  </div>
                </div>
                <p className="my-3 text-3xl font-bold">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.detail}</p>
              </article>
            );
          })}
        </div>

        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">Resource monitoring</h3>
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

        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">Server overview</h3>
              <p className="mt-1 text-sm text-slate-500">
                Resource utilization and server status
              </p>
            </div>
            <a
              href="/servers"
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View servers <ArrowUpRight size={16} />
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-3 py-3 font-medium">Server</th>
                  <th className="px-3 py-3 font-medium">IP Address</th>
                  <th className="px-3 py-3 font-medium">CPU Usage</th>
                  <th className="px-3 py-3 font-medium">RAM Usage</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {servers.map((server) => (
                  <tr
                    key={server.name}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-3 py-4 font-medium">{server.name}</td>
                    <td className="px-3 py-4 text-slate-500">{server.ip}</td>
                    <td className="px-3 py-4">
                      <MetricBar label="CPU" value={server.cpu} />
                    </td>
                    <td className="px-3 py-4">
                      <MetricBar label="RAM" value={server.ram} />
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          server.status === "Online"
                            ? "bg-emerald-100 text-emerald-700"
                            : server.status === "Warning"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {server.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

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
            <ArrowUpRight className="mt-3 text-slate-400 group-hover:text-blue-600" size={17} />
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
            <ArrowUpRight className="mt-3 text-slate-400 group-hover:text-blue-600" size={17} />
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
            <ArrowUpRight className="mt-3 text-slate-400 group-hover:text-blue-600" size={17} />
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
            <ArrowUpRight className="mt-3 text-slate-400 group-hover:text-blue-600" size={17} />
          </a>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <p>CloudOps Manager · Academic project</p>
          <p>Prototype data · Not connected to live servers</p>
        </footer>
      </section>
    </main>
  );
}
