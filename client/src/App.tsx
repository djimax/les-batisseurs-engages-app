import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import Home from "./pages/Home";
import Documents from "./pages/Documents";
import Categories from "./pages/Categories";
import Members from "./pages/Members";
import Activity from "./pages/Activity";
import Archives from "./pages/Archives";
import Finance from "./pages/Finance";
import Campaigns from "./pages/Campaigns";
import Adhesions from "./pages/Adhesions";
import Events from "./pages/Events";
import ProtectedUserManagement from "./pages/ProtectedUserManagement";
import AdminPortal from "./pages/AdminPortal";
import Announcements from "./pages/Announcements";
import EmailComposer from "./pages/EmailComposer";
import AuditHistory from "./pages/AuditHistory";
import AdminRoles from "./pages/AdminRoles";
import AdminAuditLogs from "./pages/AdminAuditLogs";
import AdminSettings from "./pages/AdminSettings";
import { CRMDashboard } from "./pages/CRMDashboard";
import CRMContacts from "./pages/CRMContacts";
import CRMActivities from "./pages/CRMActivities";
import CRMReports from "./pages/CRMReports";
import Settings from "./pages/Settings";
import GlobalSettings from "./pages/GlobalSettings";
import Login from "./pages/Login";
import { useAuth } from "./hooks/useAuth";

function OnlineRouter({ isAuthenticated, onLogout }: any) {
  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <DashboardLayout onLogout={onLogout}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/documents" component={Documents} />
        <Route path="/categories" component={Categories} />
        <Route path="/members" component={Members} />
        <Route path="/activity" component={Activity} />
        <Route path="/archives" component={Archives} />
        <Route path="/finance" component={Finance} />
        <Route path="/campaigns" component={Campaigns} />
        <Route path="/adhesions" component={Adhesions} />
        <Route path="/events" component={Events} />
        <Route path="/users" component={ProtectedUserManagement} />
        <Route path="/admin-portal" component={AdminPortal} />
        <Route path="/announcements" component={Announcements} />
        <Route path="/email-composer" component={EmailComposer} />
        <Route path="/audit-history" component={AuditHistory} />
        <Route path="/admin/roles" component={AdminRoles} />
        <Route path="/admin/audit-logs" component={AdminAuditLogs} />
        <Route path="/admin/settings" component={AdminSettings} />
        <Route path="/crm" component={CRMDashboard} />
        <Route path="/crm/contacts" component={CRMContacts} />
        <Route path="/crm/activities" component={CRMActivities} />
        <Route path="/crm/reports" component={CRMReports} />
        <Route path="/settings" component={Settings} />
        <Route path="/global-settings" component={GlobalSettings} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function Router({ isAuthenticated, onLogout }: any) {
  return <OnlineRouter isAuthenticated={isAuthenticated} onLogout={onLogout} />;
}

function App() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router 
            isAuthenticated={isAuthenticated}
            onLogout={logout}
          />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
