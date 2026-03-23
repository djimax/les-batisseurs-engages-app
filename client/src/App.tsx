import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import DashboardLayout from "./components/DashboardLayout";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

// Lazy-loaded pages
const Home = lazy(() => import("@/pages/Home"));
const Documents = lazy(() => import("@/pages/Documents"));
const Members = lazy(() => import("@/pages/Members"));
const Users = lazy(() => import("@/pages/Users"));
const Activity = lazy(() => import("@/pages/Activity"));
const Archives = lazy(() => import("@/pages/Archives"));
const Finance = lazy(() => import("@/pages/Finance"));
const Campaigns = lazy(() => import("@/pages/Campaigns"));
const Adhesions = lazy(() => import("@/pages/Adhesions"));
const Events = lazy(() => import("@/pages/Events"));
const Announcements = lazy(() => import("@/pages/Announcements"));
const EmailComposer = lazy(() => import("@/pages/EmailComposer"));
const AuditHistory = lazy(() => import("@/pages/AuditHistory"));
const AdminRoles = lazy(() => import("@/pages/AdminRoles"));
const AdminAuditLogs = lazy(() => import("@/pages/AdminAuditLogs"));
const CRMDashboard = lazy(() => import("@/pages/CRMDashboard"));
const CRMContacts = lazy(() => import("@/pages/CRMContacts"));
const CRMActivities = lazy(() => import("@/pages/CRMActivities"));
const CRMReports = lazy(() => import("@/pages/CRMReports"));
const Settings = lazy(() => import("@/pages/Settings"));
const GlobalSettings = lazy(() => import("@/pages/GlobalSettings"));
const Categories = lazy(() => import("@/pages/Categories"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

function Router() {
  return (
    <DashboardLayout>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/documents" component={Documents} />
          <Route path="/members" component={Members} />
          <Route path="/users" component={Users} />
          <Route path="/activity" component={Activity} />
          <Route path="/archives" component={Archives} />
          <Route path="/finance" component={Finance} />
          <Route path="/campaigns" component={Campaigns} />
          <Route path="/adhesions" component={Adhesions} />
          <Route path="/events" component={Events} />
          <Route path="/announcements" component={Announcements} />
          <Route path="/email-composer" component={EmailComposer} />
          <Route path="/audit-history" component={AuditHistory} />
          <Route path="/admin/roles" component={AdminRoles} />
          <Route path="/admin/audit-logs" component={AdminAuditLogs} />
          <Route path="/crm" component={CRMDashboard} />
          <Route path="/crm/contacts" component={CRMContacts} />
          <Route path="/crm/activities" component={CRMActivities} />
          <Route path="/crm/reports" component={CRMReports} />
          <Route path="/settings" component={Settings} />
          <Route path="/global-settings" component={GlobalSettings} />
          <Route path="/categories" component={Categories} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </DashboardLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <CurrencyProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
