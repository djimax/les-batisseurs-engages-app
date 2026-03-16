import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Users, AlertCircle, Activity, Shield, Database, BarChart3, LogOut } from "lucide-react";

interface DashboardAdminProps {
  totalUsers: number;
  activeUsers: number;
  systemHealth: "excellent" | "good" | "warning" | "critical";
  lastBackup: Date;
  databaseSize: string;
  recentActivities: Array<{ id: string; user: string; action: string; timestamp: Date }>;
  systemAlerts: Array<{ id: string; level: "info" | "warning" | "error"; message: string }>;
}

export function DashboardAdmin({
  totalUsers,
  activeUsers,
  systemHealth,
  lastBackup,
  databaseSize,
  recentActivities,
  systemAlerts,
}: DashboardAdminProps) {
  const getHealthColor = (health: string) => {
    switch (health) {
      case "excellent":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "good":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "warning":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "";
    }
  };

  const getHealthLabel = (health: string) => {
    switch (health) {
      case "excellent":
        return "Excellent";
      case "good":
        return "Bon";
      case "warning":
        return "Attention";
      case "critical":
        return "Critique";
      default:
        return "Inconnu";
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Tableau de Bord Administrateur</h2>
        <p className="text-red-100">Gestion système et sécurité</p>
      </div>

      {/* KPI Système */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Utilisateurs Totaux</p>
                <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
                <p className="text-xs text-muted-foreground mt-1">{activeUsers} actifs</p>
              </div>
              <Users className="h-8 w-8 text-blue-600/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Santé du Système</p>
                <Badge className={`mt-2 ${getHealthColor(systemHealth)}`}>
                  {getHealthLabel(systemHealth)}
                </Badge>
              </div>
              <Shield className="h-8 w-8 text-emerald-600/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Taille Base de Données</p>
                <p className="text-3xl font-bold text-purple-600">{databaseSize}</p>
              </div>
              <Database className="h-8 w-8 text-purple-600/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Dernière Sauvegarde</p>
                <p className="text-sm font-semibold">
                  {new Date(lastBackup).toLocaleDateString("fr-FR")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(lastBackup).toLocaleTimeString("fr-FR")}
                </p>
              </div>
              <Activity className="h-8 w-8 text-emerald-600/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes Système */}
      {systemAlerts.length > 0 && (
        <Card className="border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              Alertes Système
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className="p-2 bg-white/50 dark:bg-black/20 rounded text-sm">
                <Badge className={`mr-2 ${
                  alert.level === "error" ? "bg-red-100 text-red-800" :
                  alert.level === "warning" ? "bg-amber-100 text-amber-800" :
                  "bg-blue-100 text-blue-800"
                }`}>
                  {alert.level === "error" ? "Erreur" : alert.level === "warning" ? "Attention" : "Info"}
                </Badge>
                {alert.message}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Gestion des Utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestion des Utilisateurs
          </CardTitle>
          <CardDescription>Contrôle des accès et des permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <div>
              <p className="font-medium text-sm">Créer un Nouvel Utilisateur</p>
              <p className="text-xs text-muted-foreground">Ajouter un nouveau compte</p>
            </div>
            <Button size="sm" variant="outline">Créer</Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <div>
              <p className="font-medium text-sm">Gérer les Rôles</p>
              <p className="text-xs text-muted-foreground">Modifier les permissions</p>
            </div>
            <Button size="sm" variant="outline">Gérer</Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <div>
              <p className="font-medium text-sm">Réinitialiser les Mots de Passe</p>
              <p className="text-xs text-muted-foreground">Aider les utilisateurs</p>
            </div>
            <Button size="sm" variant="outline">Réinitialiser</Button>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Système */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration Système
          </CardTitle>
          <CardDescription>Paramètres globaux de l'application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <div>
              <p className="font-medium text-sm">Paramètres de Sécurité</p>
              <p className="text-xs text-muted-foreground">Authentification 2FA, HTTPS</p>
            </div>
            <Button size="sm" variant="outline">Configurer</Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <div>
              <p className="font-medium text-sm">Sauvegardes Automatiques</p>
              <p className="text-xs text-muted-foreground">Planifier les sauvegardes</p>
            </div>
            <Button size="sm" variant="outline">Planifier</Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <div>
              <p className="font-medium text-sm">Maintenance</p>
              <p className="text-xs text-muted-foreground">Optimisation et nettoyage</p>
            </div>
            <Button size="sm" variant="outline">Exécuter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Activité Récente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activité Récente
          </CardTitle>
          <CardDescription>Historique des actions système</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="p-3 border rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-900">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{activity.user}</p>
                      <p className="text-muted-foreground">{activity.action}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleTimeString("fr-FR")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-muted-foreground">Aucune activité</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Logs d'Audit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Logs d'Audit
          </CardTitle>
          <CardDescription>Suivi complet de tous les événements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <div>
              <p className="font-medium text-sm">Exporter les Logs</p>
              <p className="text-xs text-muted-foreground">Télécharger l'historique complet</p>
            </div>
            <Button size="sm" variant="outline">Exporter</Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <div>
              <p className="font-medium text-sm">Filtrer par Utilisateur</p>
              <p className="text-xs text-muted-foreground">Voir les actions d'un utilisateur</p>
            </div>
            <Button size="sm" variant="outline">Filtrer</Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <div>
              <p className="font-medium text-sm">Archiver les Logs</p>
              <p className="text-xs text-muted-foreground">Nettoyer les anciens logs</p>
            </div>
            <Button size="sm" variant="outline">Archiver</Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions d'Urgence */}
      <Card className="border-red-200 dark:border-red-900/50">
        <CardHeader>
          <CardTitle className="text-red-700 dark:text-red-400">Actions d'Urgence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full gap-2 bg-amber-600 hover:bg-amber-700">
            <AlertCircle className="h-4 w-4" />
            Forcer une Sauvegarde
          </Button>
          <Button className="w-full gap-2 bg-red-600 hover:bg-red-700">
            <LogOut className="h-4 w-4" />
            Déconnecter Tous les Utilisateurs
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
