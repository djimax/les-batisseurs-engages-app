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
import { getLoginUrl } from "@/const";
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
  Building2,
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
  Globe,
  Cog,
  ChevronDown
} from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from './DashboardLayoutSkeleton';
import { Button } from "./ui/button";
import { useAuth as useAuthHook } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { trpc } from "@/lib/trpc";

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
    label: "Tableau de bord",
    icon: LayoutDashboard,
    items: [
      { icon: LayoutDashboard, label: "Vue d'ensemble", path: "/" },
    ],
  },
  {
    label: "👥 Gestion des Membres",
    icon: Users,
    items: [
      { icon: Users, label: "Annuaire des Membres", path: "/members" },
      { icon: UserCheck, label: "Adhésions", path: "/adhesions" },
      { icon: Users, label: "Utilisateurs", path: "/users" },
    ],
  },
  {
    label: "💰 Finances & Campagnes",
    icon: DollarSign,
    items: [
      { icon: DollarSign, label: "Comptabilité", path: "/finance" },
      { icon: Megaphone, label: "Campagnes de Collecte", path: "/campaigns" },
      { icon: Calendar, label: "Événements & Billetterie", path: "/events" },
    ],
  },
  {
    label: "📄 Centre Documentaire",
    icon: FileText,
    items: [
      { icon: FileText, label: "Documents", path: "/documents" },
      { icon: FolderOpen, label: "Catégories", path: "/categories" },
      { icon: Archive, label: "Archives", path: "/archives" },
    ],
  },
  {
    label: "🤝 CRM & Relations",
    icon: BarChart3,
    items: [
      { icon: BarChart3, label: "Tableau de bord CRM", path: "/crm", adminOnly: true },
      { icon: Users, label: "Contacts CRM", path: "/crm/contacts", adminOnly: true },
      { icon: PhoneCall, label: "Activités CRM", path: "/crm/activities", adminOnly: true },
      { icon: BarChart3, label: "Rapports CRM", path: "/crm/reports", adminOnly: true },
    ],
  },
  {
    label: "📢 Communication",
    icon: Mail,
    items: [
      { icon: Megaphone, label: "Annonces", path: "/announcements" },
      { icon: Mail, label: "Emails", path: "/email-composer" },
    ],
  },
  {
    label: "⚙️ Administration",
    icon: Cog,
    items: [
      { icon: Settings, label: "Paramètres Globaux", path: "/global-settings", adminOnly: true },
      { icon: Shield, label: "Gestion des Rôles", path: "/admin/roles", adminOnly: true },
      { icon: Eye, label: "Journaux d'Audit", path: "/admin/audit-logs", adminOnly: true },
      { icon: Activity, label: "Activité", path: "/activity" },
      { icon: History, label: "Historique d'audit", path: "/audit-history" },
    ],
  },
];

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 260;
const MIN_WIDTH = 200;
const MAX_WIDTH = 400;

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
      style={
        {
          "--sidebar-width": `${sidebarWidth}px`,
        } as CSSProperties
      }
    >
      <DashboardLayoutContent setSidebarWidth={setSidebarWidth} onLogout={onLogout}>
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}

type DashboardLayoutContentProps = {
  children: React.ReactNode;
  setSidebarWidth: (width: number) => void;
  onLogout?: () => void;
};

function DashboardLayoutContent({
  children,
  setSidebarWidth,
  onLogout,
}: DashboardLayoutContentProps) {
  const { logout } = useAuthHook() as any;
  const handleLogout = onLogout || logout;
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(["Tableau de bord", "👥 Gestion des Membres", "💰 Finances & Campagnes"])
  );
  const isMobile = useIsMobile();
  
  // Charger les paramètres globaux en temps réel
  const { data: settings } = trpc.globalSettings.get.useQuery();

  useEffect(() => {
    if (isCollapsed) {
      setIsResizing(false);
    }
  }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - sidebarLeft;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  const toggleGroup = (groupLabel: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupLabel)) {
      newExpanded.delete(groupLabel);
    } else {
      newExpanded.add(groupLabel);
    }
    setExpandedGroups(newExpanded);
  };

  const activeItem = menuGroups
    .flatMap(g => g.items)
    .find(item => item.path === location);

  return (
    <>
      <div className="flex h-screen w-full max-w-full overflow-hidden" ref={sidebarRef}>
        <Sidebar
          collapsible="icon"
          className="border-r-0 flex-shrink-0 h-full"
          disableTransition={isResizing}
        >
          <SidebarHeader className="h-16 justify-center border-b border-primary/20">
            <div className="flex items-center gap-3 px-2 transition-all w-full">
              <button
                onClick={toggleSidebar}
                className="h-8 w-8 flex items-center justify-center hover:bg-primary/80 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent shrink-0"
                aria-label="Toggle navigation"
              >
                <PanelLeft className="h-4 w-4 text-white/80" />
              </button>
              {!isCollapsed ? (
                <div className="flex items-center gap-2 min-w-0">
                  {settings?.logo ? (
                    <img src={settings.logo} alt="Logo" className="w-8 h-8 object-contain shrink-0" />
                  ) : (
                    <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain shrink-0" />
                  )}
                  <span className="font-semibold tracking-tight truncate text-sm text-white">
                    {settings?.associationName || "Bâtisseurs Engagés"}
                  </span>
                </div>
              ) : null}
            </div>
          </SidebarHeader>

          <SidebarContent className="gap-0 pt-2 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/40 scrollbar-track-primary/10 hover:scrollbar-thumb-primary/60">
            <SidebarMenu className="px-2 py-1">
              {menuGroups.map((group) => {
                const isExpanded = expandedGroups.has(group.label);
                const hasActiveItem = group.items.some(item => item.path === location);

                return (
                  <div key={group.label} className="mb-2">
                    {/* Group Header */}
                    <button
                      onClick={() => toggleGroup(group.label)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors mb-1 ${
                        hasActiveItem
                          ? "bg-accent/20 text-accent"
                          : "text-white/60 hover:text-white/80 hover:bg-primary/50"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <group.icon className="h-4 w-4" />
                        {!isCollapsed && <span>{group.label}</span>}
                      </span>
                      {!isCollapsed && (
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>

                    {/* Group Items */}
                    {isExpanded && !isCollapsed && (
                      <div className="ml-2 space-y-1">
                        {group.items.map((item) => {
                          const isActive = location === item.path;
                          return (
                            <SidebarMenuItem key={item.path}>
                              <SidebarMenuButton
                                isActive={isActive}
                                onClick={() => setLocation(item.path)}
                                tooltip={item.label}
                                className={`h-9 text-xs transition-all font-normal ${
                                  isActive
                                    ? "bg-accent text-primary hover:bg-accent"
                                    : "text-white/70 hover:bg-primary/80 hover:text-white"
                                }`}
                              >
                                <item.icon className="h-4 w-4" />
                                <span>{item.label}</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })}
                      </div>
                    )}

                    {/* Collapsed View */}
                    {isCollapsed && (
                      <div className="space-y-1">
                        {group.items.map((item) => {
                          const isActive = location === item.path;
                          return (
                            <SidebarMenuItem key={item.path}>
                              <SidebarMenuButton
                                isActive={isActive}
                                onClick={() => setLocation(item.path)}
                                tooltip={item.label}
                                className={`h-9 transition-all ${
                                  isActive
                                    ? "bg-accent text-primary hover:bg-accent"
                                    : "text-white/70 hover:bg-primary/80 hover:text-white"
                                }`}
                              >
                                <item.icon className="h-4 w-4" />
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

          <SidebarFooter className="p-3 border-t border-primary/20">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-lg px-1 py-1 hover:bg-primary/80 transition-colors w-full text-left group-data-[collapsible=icon]:justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                  <Avatar className="h-9 w-9 border shrink-0 bg-accent">
                    <AvatarFallback className="text-xs font-medium bg-accent text-primary">
                      A
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-medium truncate leading-none text-white">
                      Admin
                    </p>
                    <p className="text-xs text-white/60 truncate mt-1.5">
                      admin@test.fr
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => setLocation("/settings")}
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Parametres</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>

          {/* Resize handle */}
          <div
            onMouseDown={() => setIsResizing(true)}
            className="absolute right-0 top-0 bottom-0 w-1 hover:bg-accent/50 cursor-col-resize transition-colors"
          />
        </Sidebar>

        <SidebarInset className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <header className="sticky top-0 z-40 flex items-center gap-4 border-b border-primary/20 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm px-6 py-4 h-16 flex-shrink-0">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {activeItem?.label || "Tableau de bord"}
              </h1>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </>
  );
}
