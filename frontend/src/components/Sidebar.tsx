
import {
  Activity,
  Bell,
  Boxes,
  Cloud,
  FolderKanban,
  LayoutDashboard,
  Server,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Projects", icon: FolderKanban, href: "/projects" },
  { label: "Servers", icon: Server, href: "/servers" },
  { label: "Applications", icon: Boxes, href: "/applications" },
  { label: "Monitoring", icon: Activity, href: "/monitoring" },
  { label: "Alerts", icon: Bell, href: "/alerts" },
  { label: "Users", icon: Users, href: "/users" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-full shrink-0 bg-slate-950 p-5 text-white md:sticky md:top-0 md:h-screen md:w-64">
      <div className="mb-8 flex items-center gap-3">
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
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <Icon size={18} />
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="mt-8 rounded-xl border border-slate-800 p-4">
        <ShieldCheck className="mb-2 text-emerald-400" size={22} />
        <p className="text-sm font-medium">Infrastructure health</p>
        <p className="mt-1 text-xs text-slate-400">
          Monitoring dashboard preview
        </p>
      </div>
    </aside>
  );
}
