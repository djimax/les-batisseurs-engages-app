import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Filter, Search, Eye, Trash2, AlertCircle } from "lucide-react";
import { useState } from "react";

interface AuditLog {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  resource: string;
  resourceId?: string;
  status: "success" | "failure" | "warning";
  ipAddress?: string;
  details?: string;
}

interface AuditLogsProps {
  logs: AuditLog[];
  onExport?: () => void;
  onDelete?: (logId: string) => void;
  onViewDetails?: (logId: string) => void;
}

const statusConfig = {
  success: { label: "Succès", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400", icon: "✓" },
  failure: { label: "Erreur", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", icon: "✕" },
  warning: { label: "Attention", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400", icon: "!" },
};

const actionConfig: Record<string, { label: string; icon: string; color: string }> = {
  create: { label: "Création", icon: "➕", color: "text-blue-600" },
  update: { label: "Modification", icon: "✏️", color: "text-amber-600" },
  delete: { label: "Suppression", icon: "🗑️", color: "text-red-600" },
  login: { label: "Connexion", icon: "🔓", color: "text-emerald-600" },
  logout: { label: "Déconnexion", icon: "🔒", color: "text-gray-600" },
  export: { label: "Export", icon: "📥", color: "text-purple-600" },
  import: { label: "Import", icon: "📤", color: "text-purple-600" },
  permission: { label: "Permission", icon: "🔐", color: "text-indigo-600" },
};

export function AuditLogs({
  logs,
  onExport,
  onDelete,
  onViewDetails,
}: AuditLogsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterAction, setFilterAction] = useState<string | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filterStatus || log.status === filterStatus;
    const matchesAction = !filterAction || log.action === filterAction;

    return matchesSearch && matchesStatus && matchesAction;
  });

  const successCount = logs.filter((l) => l.status === "success").length;
  const failureCount = logs.filter((l) => l.status === "failure").length;
  const warningCount = logs.filter((l) => l.status === "warning").length;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Journaux d'Audit</h2>
        <p className="text-indigo-100">Suivi complet de toutes les actions système</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{logs.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Événements totaux</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600">{successCount}</p>
              <p className="text-sm text-muted-foreground mt-1">Réussis</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">{failureCount}</p>
              <p className="text-sm text-muted-foreground mt-1">Erreurs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-600">{warningCount}</p>
              <p className="text-sm text-muted-foreground mt-1">Avertissements</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={onExport} className="gap-2">
          <Download className="h-4 w-4" />
          Exporter les Logs
        </Button>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtres Avancés
        </Button>
      </div>

      {/* Recherche et Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Recherche et Filtres</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher par utilisateur, action ou ressource..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setFilterStatus(null)}
              variant={filterStatus === null ? "default" : "outline"}
              size="sm"
            >
              Tous les Statuts
            </Button>
            {Object.entries(statusConfig).map(([status, config]) => (
              <Button
                key={status}
                onClick={() => setFilterStatus(status)}
                variant={filterStatus === status ? "default" : "outline"}
                size="sm"
                className="gap-1"
              >
                {config.icon} {config.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Événements ({filteredLogs.length})</CardTitle>
          <CardDescription>Affichage des {filteredLogs.length} événement(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">
                          {actionConfig[log.action]?.icon || "📝"}
                        </span>
                        <p className="font-semibold text-sm">{log.user}</p>
                        <span className={actionConfig[log.action]?.color || ""}>
                          {actionConfig[log.action]?.label || log.action}
                        </span>
                        <Badge className={statusConfig[log.status].color}>
                          {statusConfig[log.status].label}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {log.resource} {log.resourceId && `(#${log.resourceId})`}
                      </p>

                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{new Date(log.timestamp).toLocaleString("fr-FR")}</span>
                        {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                      </div>

                      {log.details && (
                        <p className="text-xs text-muted-foreground mt-1 italic">{log.details}</p>
                      )}
                    </div>

                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onViewDetails?.(log.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete?.(log.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-muted-foreground">Aucun événement trouvé</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Alertes de Sécurité */}
      <Card className="border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            Alertes de Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-red-700 dark:text-red-400">
          <p>• 3 tentatives de connexion échouées détectées</p>
          <p>• Accès à partir d'une nouvelle adresse IP</p>
          <p>• Modification de permissions d'administrateur</p>
        </CardContent>
      </Card>

      {/* Statistiques d'Activité */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques d'Activité</CardTitle>
          <CardDescription>Résumé des actions par type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(actionConfig).map(([action, config]) => {
              const count = logs.filter((l) => l.action === action).length;
              return (
                <div key={action} className="flex items-center justify-between p-2">
                  <span className="text-sm">{config.icon} {config.label}</span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
