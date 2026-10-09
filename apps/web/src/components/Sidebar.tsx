import { FileText, MessageSquare, PanelLeft, SquarePen } from "lucide-react";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { LINKEDIN_URL, WHATSAPP_URL } from "../lib/links";
import { LinkedInIcon, WhatsAppIcon } from "./BrandIcons";

type Props = {
  collapsed: boolean;
  glass?: boolean;
  onNewChat: () => void;
  onToggle: () => void;
};

export function Sidebar({ collapsed, glass = false, onNewChat, onToggle }: Props) {
  return (
    <div
      className={`flex h-full w-full flex-col ${
        glass
          ? "border-r border-white/8 bg-black/25 backdrop-blur-xl backdrop-saturate-150"
          : "bg-[var(--sidebar)]"
      }`}
    >
      <div className={`flex h-12 shrink-0 items-center px-2 ${collapsed ? "justify-center" : "gap-0.5"}`}>
        {collapsed ? (
          <IconButton onClick={onToggle} label="Abrir barra lateral">
            <PanelLeft size={20} strokeWidth={1.75} />
          </IconButton>
        ) : (
          <>
            <span className="truncate px-2 text-[15px] font-semibold tracking-tight">HoffmanAI</span>
            <IconButton onClick={onToggle} label="Fechar barra lateral">
              <PanelLeft size={20} strokeWidth={1.75} />
            </IconButton>
          </>
        )}
      </div>

      <div className={`px-2 ${collapsed ? "flex justify-center" : ""}`}>
        <Item collapsed={collapsed} onClick={onNewChat} icon={<SquarePen size={18} strokeWidth={1.75} />} label="Novo chat" />
      </div>

      <nav className={`mt-1 flex-1 space-y-0.5 overflow-y-auto px-2 pb-3 ${collapsed ? "flex flex-col items-center" : ""}`}>
        <Item collapsed={collapsed} to="/" end icon={<MessageSquare size={18} strokeWidth={1.75} />} label="Chat" />
        <Item collapsed={collapsed} to="/curriculo" icon={<FileText size={18} strokeWidth={1.75} />} label="Currículo" />
      </nav>

      <div
        className={`shrink-0 space-y-0.5 px-2 py-2 ${glass ? "border-t border-white/8" : "border-t border-white/10"} ${
          collapsed ? "flex flex-col items-center" : ""
        }`}
      >
        <Item collapsed={collapsed} href={LINKEDIN_URL} icon={<LinkedInIcon size={18} />} label="LinkedIn" />
        <Item collapsed={collapsed} href={WHATSAPP_URL} icon={<WhatsAppIcon size={18} />} label="WhatsApp" />
      </div>
    </div>
  );
}

function Item({
  collapsed,
  icon,
  label,
  onClick,
  to,
  href,
  end,
}: {
  collapsed: boolean;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  to?: string;
  href?: string;
  end?: boolean;
}) {
  const className = collapsed ? iconBtn : row;
  const body = (
    <>
      <span className="shrink-0">{icon}</span>
      {collapsed ? null : <span className="truncate">{label}</span>}
    </>
  );

  if (to) {
    return (
      <NavLink to={to} end={end} title={label} aria-label={label} className={({ isActive }) => `${className} ${isActive ? "bg-white/10" : ""}`}>
        {body}
      </NavLink>
    );
  }
  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" title={label} aria-label={label} className={className}>
        {body}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} title={label} aria-label={label} className={className}>
      {body}
    </button>
  );
}

function IconButton({ onClick, label, children }: { onClick: () => void; label: string; children: ReactNode }) {
  return (
    <button type="button" className={iconBtn} onClick={onClick} aria-label={label} title={label}>
      {children}
    </button>
  );
}

const row =
  "flex h-10 w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 text-left text-sm text-[var(--text)] transition-colors hover:bg-white/10 focus-visible:outline-none";

const iconBtn =
  "flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[var(--text)] transition-colors hover:bg-white/10 focus-visible:outline-none";
