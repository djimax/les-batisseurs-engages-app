import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, Settings, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Report {
  id: string;
  name: string;
  type: "monthly" | "quarterly" | "annual" | "custom";
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "annual" | "manual";
  lastGenerated?: Date;
  nextScheduled?: Date;
  isActive: boolean;
  sections: string[];
  recipients: string[];
}

interface AutomatedReportsProps {
  reports: Report[];
  onGenerateReport?: (reportId: string) => void;
  onEditReport?: (reportId: string) => void;
  onToggleReport?: (reportId: string) => void;
  onDownloadReport?: (reportId: string) => void;
}

const typeConfig = {
  monthly: { label: "Mensuel", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  quarterly: { label: "Trimestriel", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
  annual: { label: "Annuel", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
  custom: { label: "Personnalisé", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" },
};

const frequencyConfig = {
  daily: "Chaque jour",
  weekly: "Chaque semaine",
  monthly: "Chaque mois",
  quarterly: "Chaque trimestre",
  annual: "Chaque année",
  manual: "Manuel",
};

export function AutomatedReports({
  reports,
  onGenerateReport,
  onEditReport,
  onToggleReport,
  onDownloadReport,
}: AutomatedReportsProps) {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const activeReports = reports.filter((r) => r.isActive);
  const inactiveReports = reports.filter((r) => !r.isActive);

  const handleGenerateReport = (reportId: string) => {
    onGenerateReport?.(reportId);
    toast.success("Rapport généré avec succès !");
  };

  const handleToggleReport = (reportId: string) => {
    onToggleReport?.(reportId);
    toast.success("Rapport mis à jour");
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Rapports Automatisés</h2>
        <p className="text-orange-100">Génération et distribution automatique de rapports PDF</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{reports.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Rapports totaux</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600">{activeReports.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Actifs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-600">{inactiveReports.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Inactifs</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rapports Actifs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            Rapports Actifs
          </CardTitle>
          <CardDescription>Rapports automatisés actuellement en service</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeReports.length > 0 ? (
            activeReports.map((report) => (
              <div
                key={report.id}
                className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-orange-600" />
                      <p className="font-semibold">{report.name}</p>
                      <Badge className={typeConfig[report.type].color}>
                        {typeConfig[report.type].label}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">
                      Fréquence: {frequencyConfig[report.frequency]}
                    </p>

                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>
                        <strong>Sections incluses:</strong> {report.sections.join(", ")}
                      </p>
                      <p>
                        <strong>Destinataires:</strong> {report.recipients.join(", ")}
                      </p>
                    </div>

                    {report.lastGenerated && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Dernier rapport: {new Date(report.lastGenerated).toLocaleDateString("fr-FR")}
                      </p>
                    )}

                    {report.nextScheduled && (
                      <p className="text-xs text-muted-foreground">
                        Prochain rapport: {new Date(report.nextScheduled).toLocaleDateString("fr-FR")}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditReport?.(report.id)}
                    >
                      Éditer
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleGenerateReport(report.id)}
                      className="gap-1 bg-orange-600 hover:bg-orange-700"
                    >
                      <FileText className="h-4 w-4" />
                      Générer
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDownloadReport?.(report.id)}
                      className="gap-1"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-8 text-muted-foreground">Aucun rapport actif</p>
          )}
        </CardContent>
      </Card>

      {/* Rapports Inactifs */}
      {inactiveReports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-600" />
              Rapports Inactifs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {inactiveReports.map((report) => (
              <div
                key={report.id}
                className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <p className="font-semibold opacity-50">{report.name}</p>
                      <Badge variant="outline">{typeConfig[report.type].label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground opacity-50">
                      {frequencyConfig[report.frequency]}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleToggleReport(report.id)}
                  >
                    Activer
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Modèles de Rapports Recommandés */}
      <Card className="border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
            <AlertCircle className="h-5 w-5" />
            Modèles Recommandés
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
          <p>
            <strong>✓ Rapport Mensuel :</strong> Synthèse financière, adhésions, événements
          </p>
          <p>
            <strong>✓ Rapport Trimestriel :</strong> Analyse détaillée, tendances, KPI
          </p>
          <p>
            <strong>✓ Rapport Annuel :</strong> Bilan complet, rapports d'activité, perspectives
          </p>
          <p>
            <strong>✓ Rapport Financier :</strong> Détails comptables, dépenses, revenus
          </p>
        </CardContent>
      </Card>

      {/* Configuration des Rapports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration des Rapports
          </CardTitle>
          <CardDescription>Paramètres globaux de génération</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <div>
              <p className="font-medium text-sm">Format de Sortie</p>
              <p className="text-xs text-muted-foreground">PDF avec graphiques</p>
            </div>
            <Button size="sm" variant="outline">Modifier</Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <div>
              <p className="font-medium text-sm">Langue des Rapports</p>
              <p className="text-xs text-muted-foreground">Français</p>
            </div>
            <Button size="sm" variant="outline">Modifier</Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <div>
              <p className="font-medium text-sm">Stockage des Rapports</p>
              <p className="text-xs text-muted-foreground">Archivage automatique</p>
            </div>
            <Button size="sm" variant="outline">Configurer</Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <div>
              <p className="font-medium text-sm">Signature Numérique</p>
              <p className="text-xs text-muted-foreground">Signature du Président</p>
            </div>
            <Button size="sm" variant="outline">Configurer</Button>
          </div>
        </CardContent>
      </Card>

      {/* Historique de Génération */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Historique de Génération
          </CardTitle>
          <CardDescription>Derniers rapports générés</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded text-sm">
            <div>
              <p className="font-medium">Rapport Financier Mensuel</p>
              <p className="text-xs text-muted-foreground">Mars 2026</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Aujourd'hui</p>
              <Badge className="bg-emerald-100 text-emerald-800 mt-1">Généré</Badge>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded text-sm">
            <div>
              <p className="font-medium">Rapport d'Activité</p>
              <p className="text-xs text-muted-foreground">Février 2026</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Il y a 1 mois</p>
              <Badge className="bg-emerald-100 text-emerald-800 mt-1">Généré</Badge>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded text-sm">
            <div>
              <p className="font-medium">Rapport Trimestriel</p>
              <p className="text-xs text-muted-foreground">Q4 2025</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Il y a 3 mois</p>
              <Badge className="bg-emerald-100 text-emerald-800 mt-1">Généré</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
