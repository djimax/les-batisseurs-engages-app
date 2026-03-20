/**
 * DashboardLayout.tsx — Refonte design institutionnel
 * Les Bâtisseurs Engagés
 *
 * Palette :
 *   Sidebar    : #1C2B4A (bleu marine)
 *   Accent     : #4B9B6F (vert sauge)
 *   Fond page  : #F7F8FA
 *   Bordures   : #E5E7EB
 *   Texte      : #111827 / #6B7280
 */

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/useMobile";
import {
  LayoutDashboard,
  LogOut,
  PanelLeft,
  Users,
  FileText,
  FolderOpen,
  Settings,
  Activity,
  Archive,
  DollarSign,
  Megaphone,
  UserCheck,
  Calendar,
  History,
  Shield,
  Eye,
  Mail,
  BarChart3,
  PhoneCall,
  Cog,
  ChevronDown,
  Bell,
  Search,
} from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { trpc } from "@/lib/trpc";
import { useAuth as useAuthHook } from "@/_core/hooks/useAuth";

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  adminOnly?: boolean;
}

interface MenuGroup {
  label: string;
  icon: any;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    label: "Principal",
    icon: LayoutDashboard,
    items: [
      { icon: LayoutDashboard, label: "Vue d'ensemble", path: "/" },
    ],
  },
  {
    label: "Membres",
    icon: Users,
    items: [
      { icon: Users, label: "Annuaire", path: "/members" },
      { icon: UserCheck, label: "Adhésions", path: "/adhesions" },
      { icon: Users, label: "Utilisateurs", path: "/users" },
    ],
  },
  {
    label: "Finances",
    icon: DollarSign,
    items: [
      { icon: DollarSign, label: "Comptabilité", path: "/finance" },
      { icon: Megaphone, label: "Campagnes", path: "/campaigns" },
      { icon: Calendar, label: "Événements", path: "/events" },
    ],
  },
  {
    label: "Documents",
    icon: FileText,
    items: [
      { icon: FileText, label: "Documents", path: "/documents" },
      { icon: FolderOpen, label: "Catégories", path: "/categories" },
      { icon: Archive, label: "Archives", path: "/archives" },
    ],
  },
  {
    label: "CRM",
    icon: BarChart3,
    items: [
      { icon: BarChart3, label: "Tableau de bord", path: "/crm", adminOnly: true },
      { icon: Users, label: "Contacts", path: "/crm/contacts", adminOnly: true },
      { icon: PhoneCall, label: "Activités", path: "/crm/activities", adminOnly: true },
      { icon: BarChart3, label: "Rapports", path: "/crm/reports", adminOnly: true },
    ],
  },
  {
    label: "Communication",
    icon: Mail,
    items: [
      { icon: Megaphone, label: "Annonces", path: "/announcements" },
      { icon: Mail, label: "Emails", path: "/email-composer" },
    ],
  },
  {
    label: "Administration",
    icon: Cog,
    items: [
      { icon: Settings, label: "Paramètres", path: "/global-settings", adminOnly: true },
      { icon: Shield, label: "Rôles", path: "/admin/roles", adminOnly: true },
      { icon: Eye, label: "Journaux", path: "/admin/audit-logs", adminOnly: true },
      { icon: Activity, label: "Activité", path: "/activity" },
      { icon: History, label: "Historique", path: "/audit-history" },
    ],
  },
];

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 240;
const MIN_WIDTH = 200;
const MAX_WIDTH = 360;

// ─── Couleurs sidebar ────────────────────────────────────────────────────────
const S = {
  bg: "#1C2B4A",
  accent: "#4B9B6F",
  accentLight: "rgba(75,155,111,0.15)",
  border: "rgba(255,255,255,0.08)",
  textPrimary: "#ffffff",
  textMuted: "rgba(255,255,255,0.5)",
  textHint: "rgba(255,255,255,0.3)",
  hoverBg: "rgba(255,255,255,0.06)",
  activeBg: "rgba(75,155,111,0.18)",
};

export default function DashboardLayout({
  children,
  onLogout,
}: {
  children: React.ReactNode;
  onLogout?: () => void;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  return (
    <SidebarProvider
      style={{ "--sidebar-width": `${sidebarWidth}px` } as CSSProperties}
    >
      <DashboardLayoutContent
        setSidebarWidth={setSidebarWidth}
        onLogout={onLogout}
      >
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}

function DashboardLayoutContent({
  children,
  setSidebarWidth,
  onLogout,
}: {
  children: React.ReactNode;
  setSidebarWidth: (w: number) => void;
  onLogout?: () => void;
}) {
  const { logout } = useAuthHook() as any;
  const handleLogout = onLogout || logout;
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { data: settings } = trpc.globalSettings.get.useQuery();

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(["Principal", "Membres", "Finances"])
  );

  useEffect(() => {
    if (isCollapsed) setIsResizing(false);
  }, [isCollapsed]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const left = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const w = e.clientX - left;
      if (w >= MIN_WIDTH && w <= MAX_WIDTH) setSidebarWidth(w);
    };
    const onUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    if (isResizing) {
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [isResizing, setSidebarWidth]);

  const toggleGroup = (label: string) => {
    const next = new Set(expandedGroups);
    next.has(label) ? next.delete(label) : next.add(label);
    setExpandedGroups(next);
  };

  const activeItem = menuGroups
    .flatMap((g) => g.items)
    .find((i) => i.path === location);

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div
      className="flex h-screen w-full max-w-full overflow-hidden"
      ref={sidebarRef}
      style={{ background: "#F7F8FA" }}
    >
      <Sidebar
        collapsible="icon"
        className="border-r-0 flex-shrink-0 h-full"
        disableTransition={isResizing}
        style={{ background: S.bg }}
      >
        {/* ── Header ── */}
        <SidebarHeader
          style={{
            background: S.bg,
            borderBottom: `0.5px solid ${S.border}`,
            padding: "0 12px",
            height: 60,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
            <button
              onClick={toggleSidebar}
              style={{
                width: 32, height: 32,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "transparent", border: "none", cursor: "pointer",
                borderRadius: 7, color: S.textMuted,
                flexShrink: 0,
              }}
            >
              <PanelLeft size={16} />
            </button>

            {!isCollapsed && (
              <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
                {settings?.logo ? (
                  <img src={settings.logo} alt="Logo" style={{ width: 28, height: 28, objectFit: "contain", borderRadius: 6 }} />
                ) : (
                  <div style={{
                    width: 28, height: 28, borderRadius: 6,
                    background: S.accent,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <div style={{ width: 14, height: 14, border: "2px solid #fff", borderRadius: 3 }} />
                  </div>
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: S.textPrimary, fontSize: 13, fontWeight: 600, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {settings?.associationName || "Bâtisseurs Engagés"}
                  </div>
                  <div style={{ color: S.textHint, fontSize: 10, marginTop: 1 }}>Association</div>
                </div>
              </div>
            )}
          </div>
        </SidebarHeader>

        {/* ── Nav ── */}
        <SidebarContent
          style={{ background: S.bg, padding: "8px 0", overflowY: "auto" }}
          className="scrollbar-thin scrollbar-thumb-white/10"
        >
          <SidebarMenu style={{ padding: "0 8px" }}>
            {menuGroups.map((group) => {
              const isExpanded = expandedGroups.has(group.label);
              const hasActive = group.items.some((i) => i.path === location);

              return (
                <div key={group.label} style={{ marginBottom: 4 }}>
                  {/* Section header */}
                  {!isCollapsed && (
                    <button
                      onClick={() => toggleGroup(group.label)}
                      style={{
                        width: "100%",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "6px 10px",
                        borderRadius: 7,
                        border: "none",
                        background: hasActive ? S.accentLight : "transparent",
                        cursor: "pointer",
                        marginBottom: 2,
                      }}
                    >
                      <span style={{
                        display: "flex", alignItems: "center", gap: 7,
                        color: hasActive ? S.accent : S.textMuted,
                        fontSize: 11, fontWeight: 600,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}>
                        <group.icon size={13} />
                        {group.label}
                      </span>
                      <ChevronDown
                        size={12}
                        style={{
                          color: S.textHint,
                          transform: isExpanded ? "rotate(180deg)" : "none",
                          transition: "transform 0.2s",
                        }}
                      />
                    </button>
                  )}

                  {/* Items */}
                  {(isExpanded || isCollapsed) && (
                    <div style={{ paddingLeft: isCollapsed ? 0 : 8 }}>
                      {group.items.map((item) => {
                        const isActive = location === item.path;
                        return (
                          <SidebarMenuItem key={item.path}>
                            <SidebarMenuButton
                              isActive={isActive}
                              onClick={() => setLocation(item.path)}
                              tooltip={item.label}
                              style={{
                                height: 34,
                                borderRadius: 7,
                                marginBottom: 1,
                                fontSize: 12.5,
                                fontWeight: isActive ? 500 : 400,
                                background: isActive ? S.activeBg : "transparent",
                                color: isActive ? S.accent : S.textMuted,
                                borderLeft: isActive ? `3px solid ${S.accent}` : "3px solid transparent",
                                paddingLeft: isActive ? 9 : 12,
                                transition: "all 0.15s",
                              }}
                              className="hover:bg-white/5 hover:text-white"
                            >
                              <item.icon size={14} />
                              <span>{item.label}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        {/* ── Footer ── */}
        <SidebarFooter
          style={{
            background: S.bg,
            borderTop: `0.5px solid ${S.border}`,
            padding: "10px 10px",
          }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                style={{
                  display: "flex", alignItems: "center", gap: 9,
                  width: "100%", padding: "6px 6px",
                  background: "transparent", border: "none", cursor: "pointer",
                  borderRadius: 8,
                  textAlign: "left",
                }}
                className="hover:bg-white/5"
              >
                <Avatar style={{ width: 32, height: 32, background: S.accent, flexShrink: 0 }}>
                  <AvatarFallback style={{ background: S.accent, color: "#fff", fontSize: 11, fontWeight: 600 }}>
                    A
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ color: S.textPrimary, fontSize: 12, fontWeight: 500, lineHeight: 1.3 }}>Admin</div>
                    <div style={{ color: S.textHint, fontSize: 10, marginTop: 1 }}>admin@test.fr</div>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setLocation("/settings")} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>

        {/* Resize handle */}
        <div
          onMouseDown={() => setIsResizing(true)}
          style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: 4,
            cursor: "col-resize", zIndex: 10,
          }}
          className="hover:bg-accent/30 transition-colors"
        />
      </Sidebar>

      {/* ── Main content ── */}
      <SidebarInset
        className="flex flex-col flex-1 min-w-0 overflow-hidden"
        style={{ background: "#F7F8FA" }}
      >
        {/* Topbar */}
        <header
          style={{
            height: 60,
            background: "#ffffff",
            borderBottom: "0.5px solid #E5E7EB",
            display: "flex", alignItems: "center",
            padding: "0 20px",
            gap: 12,
            flexShrink: 0,
            position: "sticky", top: 0, zIndex: 40,
          }}
        >
          <SidebarTrigger style={{ color: "#6B7280" }} />

          {/* Fil d'Ariane */}
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 11, color: "#9CA3AF" }}>
              Les Bâtisseurs Engagés
            </span>
            <span style={{ fontSize: 11, color: "#D1D5DB", margin: "0 6px" }}>/</span>
            <span style={{ fontSize: 11, color: "#374151", fontWeight: 500 }}>
              {activeItem?.label || "Vue d'ensemble"}
            </span>
          </div>

          {/* Actions topbar */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Recherche */}
            <button
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "6px 12px",
                background: "#F9FAFB",
                border: "0.5px solid #E5E7EB",
                borderRadius: 8,
                color: "#9CA3AF",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              <Search size={13} />
              {!isMobile && <span>Rechercher...</span>}
            </button>

            {/* Notifications */}
            <button
              style={{
                width: 34, height: 34,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "#F9FAFB",
                border: "0.5px solid #E5E7EB",
                borderRadius: 8,
                color: "#6B7280",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <Bell size={15} />
              <span style={{
                position: "absolute", top: 6, right: 6,
                width: 6, height: 6,
                background: "#4B9B6F",
                borderRadius: "50%",
                border: "1.5px solid #fff",
              }} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main
          style={{ flex: 1, overflowY: "auto", padding: "24px" }}
        >
          {children}
        </main>
      </SidebarInset>
    </div>
  );
}
