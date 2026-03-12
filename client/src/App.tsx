import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import Home from "./pages/Home";
import Documents from "./pages/Documents";
import Members from "./pages/Members";
import Users from "./pages/Users";
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
import Categories from "./pages/Categories";

function App() {
  const handleLogout = () => {
    // Simple logout - just redirect to home
    window.location.href = "/";
  };

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <DashboardLayout onLogout={handleLogout}>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/documents" component={Documents} />
              <Route path="/categories" component={Categories} />
              <Route path="/members" component={Members} />
              <Route path="/users" component={Users} />
              <Route path="/finance" component={Finance} />
              <Route path="/activity" component={Activity} />
              <Route path="/archives" component={Archives} />
              <Route path="/campaigns" component={Campaigns} />
              <Route path="/adhesions" component={Adhesions} />
              <Route path="/events" component={Events} />
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
              <Route component={NotFound} />
            </Switch>
          </DashboardLayout>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
