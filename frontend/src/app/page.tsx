
import {
  Activity,
  Bell,
  Boxes,
  Cloud,
  LayoutDashboard,
  Server,
  Settings,
  ShieldCheck,
  Users,
  FolderKanban,
} from "lucide-react";

const stats = [
  { label: "Total Projects", value: "12", detail: "Across all environments" },
  { label: "Total Servers", value: "24", detail: "3 servers offline" },
  { label: "Applications", value: "18", detail: "15 running" },
  { label: "Active Alerts", value: "4", detail: "2 require attention" },
];

const servers = [
  { name: "web-server-01", ip: "10.0.1.10", cpu: 32, ram: 54, status: "Online" },
  { name: "api-server-01", ip: "10.0.1.20", cpu: 78, ram: 82, status: "Warning" },
  { name: "db-server-01", ip: "10.0.1.30", cpu: 24, ram: 46, status: "Online" },
  { name: "worker-server-01", ip: "10.0.1.40", cpu: 0, ram: 0, status: "Offline" },
];

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Projects", icon: FolderKanban },
  { label: "Servers", icon: Server },
  { label: "Applications", icon: Boxes },
  { label: "Monitoring", icon: Activity },
  { label: "Alerts", icon: Bell },
  { label: "Users", icon: Users },
  { label: "Settings", icon: Settings },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 md:flex">
      <aside className="w-full bg-slate-950 p-5 text-white md:min-h-screen md:w-64 md:shrink-0">
        <div className="mb-10 flex items-center gap-3">
          <div className="rounded-lg bg-blue-600 p-2">
            <Cloud size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold">CloudOps Manager</h1>
            <p className="text-xs text-slate-400">Infrastructure platform</p>
          </div>
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Workspace
        </p>

        <nav className="space-y-1">
          {navigation.map((item, index) => {
            const Icon = item.icon;
            const active = index === 0;

            return (
              <a
                key={item.label}
                href={index === 0 ? "/" : `/${item.label.toLowerCase()}`}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="mt-10 rounded-xl border border-slate-800 p-4">
          <ShieldCheck className="mb-2 text-emerald-400" size={22} />
          <p className="text-sm font-medium">Infrastructure status</p>
          <p className="mt-1 text-xs text-slate-400">
            Monitoring dashboard preview
          </p>
        </div>
      </aside>

      <section className="min-w-0 flex-1 p-5 md:p-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Workspace / Overview</p>
            <h2 className="mt-1 text-2xl font-bold">Dashboard</h2>
            <p className="mt-1 text-sm text-slate-500">
              Monitor your cloud infrastructure in one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              aria-label="Notifications"
              className="rounded-lg border border-slate-200 bg-white p-3 hover:bg-slate-50"
            >
              <Bell size={20} />
            </button>
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
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="my-3 text-3xl font-bold">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.detail}</p>
            </article>
          ))}
        </div>

        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h3 className="font-semibold">Server overview</h3>
            <p className="mt-1 text-sm text-slate-500">
              Sample server inventory for the dashboard prototype
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-3 py-3 font-medium">Server</th>
                  <th className="px-3 py-3 font-medium">IP Address</th>
                  <th className="px-3 py-3 font-medium">CPU</th>
                  <th className="px-3 py-3 font-medium">RAM</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {servers.map((server) => (
                  <tr key={server.name} className="border-b border-slate-100 last:border-0">
                    <td className="px-3 py-4 font-medium">{server.name}</td>
                    <td className="px-3 py-4 text-slate-500">{server.ip}</td>
                    <td className="px-3 py-4">{server.cpu}%</td>
                    <td className="px-3 py-4">{server.ram}%</td>
                    <td className="px-3 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          server.status === "Online"
                            ? "bg-emerald-100 text-emerald-700"
                            : server.status === "Warning"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {server.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <p>CloudOps Manager · Academic project</p>
          <p>Prototype data · Not connected to live servers</p>
        </footer>
      </section>
    </main>
  );
}
