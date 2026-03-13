import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  FolderOpen,
  Users,
  ArrowRight,
  Plus,
  Sparkles,
  Activity,
  MapPin,
  FileCheck,
  Building2,
  Mail,
  Globe
} from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

const ORGANIZATION_INFO = {
  name: "Les Batisseurs Engages",
  location: "N'djaména, Tchad",
  folio: "10512",
  email: "contact.lesbatisseursengages@gmail.com",
  website: "www.lesbatisseursengage.com",
};

export default function Home() {
  const [, setLocation] = useLocation();
  const { data: stats, isLoading: statsLoading } = trpc.documents.stats.useQuery();
  const { data: categories, isLoading: categoriesLoading } = trpc.categories.list.useQuery();
  const { data: documents, isLoading: documentsLoading } = trpc.documents.list.useQuery({});

  const recentDocs = documents?.slice(0, 5) || [];
  const urgentDocs = documents?.filter(d => d.priority === "urgent" && d.status !== "completed") || [];

  const statCards = [
    {
      title: "Total Documents",
      value: stats?.total || 0,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Complétés",
      value: stats?.completed || 0,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      title: "En cours",
      value: stats?.inProgress || 0,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      gradient: "from-orange-500 to-orange-600",
    },
    {
      title: "En attente",
      value: stats?.pending || 0,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      gradient: "from-amber-500 to-amber-600",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="status-completed">Complété</Badge>;
      case "in-progress":
        return <Badge className="status-in-progress">En cours</Badge>;
      default:
        return <Badge className="status-pending">En attente</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge className="priority-urgent">Urgent</Badge>;
      case "high":
        return <Badge className="priority-high">Haute</Badge>;
      case "medium":
        return <Badge className="priority-medium">Moyenne</Badge>;
      default:
        return <Badge className="priority-low">Basse</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* HERO SECTION */}
      <div className="gradient-hero rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6" />
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Bienvenue sur votre Portail
              </h1>
            </div>
            <p className="text-blue-100 text-lg max-w-2xl">
              Plateforme complète de gestion documentaire, financière et administrative pour votre association
            </p>
            
            {/* Mini stats inline dans le hero */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-200" />
                <div>
                  <p className="text-2xl font-bold">{stats?.total || 0}</p>
                  <p className="text-xs text-blue-200">Documents</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-200" />
                <div>
                  <p className="text-2xl font-bold">{categories?.length || 0}</p>
                  <p className="text-xs text-blue-200">Catégories</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => setLocation("/documents")} 
              className="bg-white text-blue-600 hover:bg-blue-50 gap-2 shadow-lg btn-glow h-12 px-6"
              size="lg"
            >
              <FolderOpen className="h-5 w-5" />
              Documents
            </Button>
            <Button 
              onClick={() => setLocation("/members")} 
              variant="outline"
              className="border-white text-white hover:bg-white/20 gap-2 h-12 px-6"
              size="lg"
            >
              <Users className="h-5 w-5" />
              Membres
            </Button>
          </div>
        </div>
      </div>

      {/* Organization Contact Info */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          Informations de l'Association
        </h2>
        
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Siège Social</p>
                  <p className="text-base font-semibold">{ORGANIZATION_INFO.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileCheck className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Folio</p>
                  <p className="text-base font-semibold">{ORGANIZATION_INFO.folio}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <a href={`mailto:${ORGANIZATION_INFO.email}`} className="text-base font-semibold text-blue-600 hover:underline">
                    {ORGANIZATION_INFO.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Site Web</p>
                  <a href={`https://${ORGANIZATION_INFO.website}`} target="_blank" rel="noopener noreferrer" className="text-base font-semibold text-blue-600 hover:underline">
                    {ORGANIZATION_INFO.website}
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* STATS GRID */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          Statistiques en Direct
        </h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-fade-in-up">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-10 rounded-xl" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-12 mb-2" />
                  <Skeleton className="h-3 w-16" />
                </CardContent>
              </Card>
            ))
          ) : (
            statCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Card 
                  key={index} 
                  className="hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                 
                  onClick={() => setLocation("/documents")}
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </CardTitle>
                    <div className={`${card.bgColor} p-3 rounded-xl`}>
                      <Icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {card.title === "Total Documents" && "documents au total"}
                      {card.title === "Complétés" && "documents complétés"}
                      {card.title === "En cours" && "en cours de traitement"}
                      {card.title === "En attente" && "en attente de traitement"}
                    </p>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* RECENT DOCUMENTS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Documents Récents
          </h2>
          <Button 
            onClick={() => setLocation("/documents")}
            variant="outline" 
            size="sm"
            className="gap-2"
          >
            Voir tous <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {documentsLoading ? (
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-3 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recentDocs.length > 0 ? (
          <div className="grid gap-4">
            {recentDocs.map((doc) => (
              <Card 
                key={doc.id}
                className="hover:shadow-md transition-all cursor-pointer"
                onClick={() => setLocation(`/documents`)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-base mb-1">{doc.title}</p>
                      <p className="text-sm text-muted-foreground mb-2">{doc.description}</p>
                      <div className="flex gap-2">
                        {getStatusBadge(doc.status)}
                        {getPriorityBadge(doc.priority)}
                      </div>
                    </div>
                    <FileText className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Aucun document pour le moment</p>
              <Button 
                onClick={() => setLocation("/documents")}
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer un document
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* URGENT DOCUMENTS */}
      {urgentDocs.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-6 w-6" />
            Documents Urgents
          </h2>

          <div className="grid gap-4">
            {urgentDocs.map((doc) => (
              <Card 
                key={doc.id}
                className="border-red-200 bg-red-50 dark:bg-red-950/30 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setLocation(`/documents`)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-base mb-1">{doc.title}</p>
                      <p className="text-sm text-muted-foreground mb-2">{doc.description}</p>
                      <div className="flex gap-2">
                        {getStatusBadge(doc.status)}
                        {getPriorityBadge(doc.priority)}
                      </div>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* QUICK ACTIONS */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Actions Rapides
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={() => setLocation("/documents")}
            className="h-24 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            size="lg"
          >
            <FileText className="h-6 w-6" />
            <span>Voir Documents</span>
          </Button>

          <Button 
            onClick={() => setLocation("/members")}
            className="h-24 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
            size="lg"
          >
            <Users className="h-6 w-6" />
            <span>Gérer Membres</span>
          </Button>

          <Button 
            onClick={() => setLocation("/finance")}
            className="h-24 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            size="lg"
          >
            <TrendingUp className="h-6 w-6" />
            <span>Finances</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
