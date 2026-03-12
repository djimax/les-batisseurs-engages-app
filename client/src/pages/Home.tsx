import { trpc } from "@/lib/trpc";
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
  Cloud,
  Zap,
  Globe,
  Wifi,
  Mail,
  MapPin,
  FileCheck,
  Building2
} from "lucide-react";
import { useLocation } from "wouter";
import { RoleSelector } from "@/components/RoleSelector";
import { useRole } from "@/hooks/useRole";
import { useCurrency } from "@/contexts/CurrencyContext";
import React from "react";

const ORGANIZATION_INFO = {
  name: "Les Batisseurs Engages",
  location: "N'djaména, Tchad",
  folio: "10512",
  email: "contact.lesbatisseursengages@gmail.com",
  website: "www.lesbatisseursengage.com",
};

export default function Home() {
  const [, setLocation] = useLocation();
  const { isAdmin } = useRole();
  const [mode, setMode] = React.useState<'online' | 'offline'>('online');
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
      {/* 🎨 HERO SECTION avec sélecteur de mode */}
      <div className="gradient-hero rounded-3xl p-8 text-white shadow-2xl animate-fade-in-up">
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
              <Plus className="h-5 w-5" />
              Nouveau document
            </Button>
            <Button 
              onClick={() => window.open("https://www.lesbatisseursengages.com/", "_blank")} 
              className="bg-blue-100 text-blue-700 hover:bg-blue-200 gap-2 shadow-lg h-12 px-6"
              size="lg"
              variant="outline"
            >
              <Globe className="h-5 w-5" />
              Visiter le site
            </Button>
          </div>
        </div>
      </div>

      {/* 🔄 MODE SELECTOR - Affichage toujours visible */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Sélectionner votre Mode
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Online Mode */}
          <Card className={`hover:shadow-lg transition-all cursor-pointer border-2 ${mode === 'online' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' : 'hover:border-primary'}`}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <Cloud className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Mode En Ligne</CardTitle>
                  {mode === 'online' && <Badge className="mt-1 bg-blue-600">Actif</Badge>}
                </div>
              </div>
              <CardDescription>
                Accès depuis n'importe où avec synchronisation cloud
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">✨ Avantages :</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✅ Accès depuis n'importe quel ordinateur</li>
                  <li>✅ Données synchronisées en temps réel</li>
                  <li>✅ Stockage illimité dans le cloud</li>
                  <li>✅ Partage facile entre membres</li>
                  <li>✅ Sauvegarde automatique</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">⚠️ Requis :</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Connexion Internet</li>
                  <li>• Compte Manus</li>
                </ul>
              </div>
              <Button
                onClick={() => {
                  setMode('online');
                  setLocation('/documents');
                }}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <Globe className="w-4 h-4 mr-2" />
                Utiliser Mode En Ligne
              </Button>
            </CardContent>
          </Card>

          {/* Offline Mode */}
          <Card className={`hover:shadow-lg transition-all cursor-pointer border-2 ${mode === 'offline' ? 'border-green-500 bg-green-50 dark:bg-green-950/30' : 'hover:border-primary'}`}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle>Mode Hors Ligne</CardTitle>
                  {mode === 'offline' && <Badge className="mt-1 bg-green-600">Actif</Badge>}
                </div>
              </div>
              <CardDescription>
                Utilisez l'application sans connexion Internet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">✨ Avantages :</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✅ Aucune connexion Internet requise</li>
                  <li>✅ Données stockées localement</li>
                  <li>✅ Utilisation immédiate</li>
                  <li>✅ Pas d'authentification</li>
                  <li>✅ Parfait pour les réunions offline</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">⚠️ Limitations :</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Données locales uniquement</li>
                  <li>• Pas de synchronisation</li>
                </ul>
              </div>
              <Button
                onClick={() => {
                  setMode('offline');
                  setLocation('/offline');
                }}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <Wifi className="w-4 h-4 mr-2" />
                Utiliser Mode Hors Ligne
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info Box */}
        <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="text-2xl">ℹ️</div>
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Vous pouvez changer de mode à tout moment</p>
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  Vous pouvez passer du mode en ligne au mode hors ligne (et vice versa) en utilisant les boutons ci-dessus.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
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

      {/* 📊 STATS GRID - Cartes avec animations */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 animate-slide-in-right">
          <TrendingUp className="h-6 w-6 text-primary" />
          Statistiques en Direct
        </h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-10 rounded-xl" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-16" />
                </CardContent>
              </Card>
            ))
          ) : (
            statCards.map((stat, index) => (
              <Card 
                key={stat.title} 
                className={`card-hover overflow-hidden relative animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient subtle en arrière-plan */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`}></div>
                
                <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-3 rounded-xl ${stat.bgColor} transition-transform hover:scale-110`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* 🚨 URGENT DOCUMENTS - Avec animation pulse */}
      {urgentDocs.length > 0 && (
        <Card className="border-red-200 dark:border-red-900/50 bg-gradient-to-br from-red-50/80 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20 animate-fade-in-up shadow-lg shadow-red-500/10" style={{ animationDelay: `0.5s` }}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 animate-pulse" />
              </div>
              <CardTitle className="text-lg text-red-800 dark:text-red-300">
                🔥 Documents urgents ({urgentDocs.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {urgentDocs.slice(0, 3).map((doc) => (
                <div 
                  key={doc.id} 
                  className="flex items-center justify-between p-4 bg-white dark:bg-card rounded-xl border border-red-100 dark:border-red-900/30 hover:shadow-md transition-all cursor-pointer card-hover"
                  onClick={() => setLocation("/documents")}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30">
                      <FileText className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <span className="font-medium">{doc.title}</span>
                  </div>
                  {getStatusBadge(doc.status)}
                </div>
              ))}
              {urgentDocs.length > 3 && (
                <Button 
                  variant="ghost" 
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                  onClick={() => setLocation("/documents")}
                >
                  Voir tous les documents urgents ({urgentDocs.length - 3} de plus)
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 📂 OVERVIEW SECTION */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 animate-slide-in-right">
          <FolderOpen className="h-6 w-6 text-primary" />
          Vue d'Ensemble
        </h2>
        
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 📄 Recent Documents - Card avec glassmorphism */}
          <Card className="glass-card card-hover animate-fade-in-up delay-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Documents récents
                </CardTitle>
                <CardDescription>Les derniers documents modifiés</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setLocation("/documents")}
                className="hover:bg-primary/10"
              >
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {documentsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentDocs.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Aucun document</p>
              ) : (
                <div className="space-y-3">
                  {recentDocs.map((doc, index) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                      onClick={() => setLocation("/documents")}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors flex-shrink-0">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{doc.title}</p>
                          <p className="text-xs text-muted-foreground">Document</p>
                        </div>
                      </div>
                      {getPriorityBadge(doc.priority)}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 📊 Quick Stats */}
          <Card className="glass-card card-hover animate-fade-in-up delay-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Résumé Rapide
              </CardTitle>
              <CardDescription>Aperçu de votre activité</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm">Complétés</span>
                  </div>
                  <span className="font-bold text-lg">{stats?.completed || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">En cours</span>
                  </div>
                  <span className="font-bold text-lg">{stats?.inProgress || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <span className="text-sm">En attente</span>
                  </div>
                  <span className="font-bold text-lg">{stats?.pending || 0}</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setLocation("/documents")}
                >
                  Voir tous les documents
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Role Selector (Dev) - Hidden by default */}
      <details className="group">
        <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors py-2 px-3 rounded-lg hover:bg-muted/50">
          ⚙️ Outils de développement
        </summary>
        <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-muted">
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            <RoleSelector />
          </div>
        </div>
      </details>
    </div>
  );
}
