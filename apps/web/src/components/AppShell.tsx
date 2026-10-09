import { PanelLeft, SquarePen } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clearChatSession } from "../lib/session";
import { Sidebar } from "./Sidebar";

const SIDEBAR_KEY = "hoffmanai.sidebarCollapsed";

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(SIDEBAR_KEY) === "1");
  const [mobileOpen, setMobileOpen] = useState(false);
  const desktop = useIsDesktop();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => setMobileOpen(false), [location.pathname]);

  function toggleSidebar() {
    if (desktop) {
      const next = !collapsed;
      setCollapsed(next);
      localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0");
    } else {
      setMobileOpen((open) => !open);
    }
  }

  function onNewChat() {
    clearChatSession();
    navigate("/");
    setMobileOpen(false);
  }

  const title = location.pathname.startsWith("/curriculo") ? "Currículo" : "HoffmanAI";
  const sidebarCollapsed = desktop ? collapsed : false;
  const mobileHidden = !desktop && !mobileOpen;

  return (
    <div className="flex h-dvh overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          aria-label="Fechar barra lateral"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        inert={mobileHidden}
        style={desktop ? { width: collapsed ? 60 : 260 } : undefined}
        className={`fixed inset-y-0 left-0 z-40 shrink-0 overflow-hidden transition-[width,transform] duration-200 ease-out md:static md:translate-x-0 ${
          mobileOpen ? "w-[260px] translate-x-0" : "w-[260px] -translate-x-full md:translate-x-0"
        }`}
      >
        <Sidebar collapsed={sidebarCollapsed} onNewChat={onNewChat} onToggle={toggleSidebar} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="relative flex h-12 shrink-0 items-center px-2 md:hidden">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-24">
            <span className="truncate text-sm font-medium">{title}</span>
          </div>
          <div className="relative z-10 flex items-center">
            <button type="button" className={iconBtn} onClick={() => setMobileOpen(true)} aria-label="Abrir barra lateral">
              <PanelLeft size={20} strokeWidth={1.75} />
            </button>
            <button type="button" className={iconBtn} onClick={onNewChat} aria-label="Novo chat">
              <SquarePen size={18} strokeWidth={1.75} />
            </button>
          </div>
        </header>

        <header className="relative hidden h-12 shrink-0 items-center justify-center px-4 md:flex">
          <span className="truncate text-sm font-medium">{title}</span>
        </header>

        <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
}

function useIsDesktop() {
  const [desktop, setDesktop] = useState(() => window.matchMedia("(min-width: 768px)").matches);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const onChange = () => setDesktop(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  return desktop;
}

const iconBtn =
  "flex size-10 cursor-pointer items-center justify-center rounded-lg text-[var(--text)] transition-colors hover:bg-white/10 focus-visible:outline-none";
