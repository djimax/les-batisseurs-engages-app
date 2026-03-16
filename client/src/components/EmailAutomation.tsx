import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Send, Settings, CheckCircle2, Clock, AlertCircle, Eye, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EmailTemplate {
  id: string;
  name: string;
  type: "receipt" | "reminder" | "notification" | "newsletter";
  subject: string;
  description: string;
  isActive: boolean;
  recipientCount?: number;
  lastSent?: Date;
  nextScheduled?: Date;
}

interface EmailAutomationProps {
  templates: EmailTemplate[];
  onSendTemplate?: (templateId: string) => void;
  onEditTemplate?: (templateId: string) => void;
  onToggleTemplate?: (templateId: string) => void;
  onDeleteTemplate?: (templateId: string) => void;
}

const typeConfig = {
  receipt: { label: "Reçu", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", icon: "📄" },
  reminder: { label: "Relance", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400", icon: "🔔" },
  notification: { label: "Notification", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400", icon: "📢" },
  newsletter: { label: "Infolettre", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400", icon: "📰" },
};

export function EmailAutomation({
  templates,
  onSendTemplate,
  onEditTemplate,
  onToggleTemplate,
  onDeleteTemplate,
}: EmailAutomationProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const activeTemplates = templates.filter((t) => t.isActive);
  const inactiveTemplates = templates.filter((t) => !t.isActive);

  const handleSendTemplate = (templateId: string) => {
    onSendTemplate?.(templateId);
    toast.success("Email(s) envoyé(s) avec succès !");
  };

  const handleToggleTemplate = (templateId: string) => {
    onToggleTemplate?.(templateId);
    toast.success("Modèle mis à jour");
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Automatisation des Emails</h2>
        <p className="text-purple-100">Gérez les communications automatiques de votre association</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{activeTemplates.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Modèles actifs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600">
                {templates.reduce((sum, t) => sum + (t.recipientCount || 0), 0)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Destinataires totaux</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-600">{inactiveTemplates.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Modèles inactifs</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modèles Actifs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            Modèles Actifs
          </CardTitle>
          <CardDescription>Emails automatisés actuellement en service</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeTemplates.length > 0 ? (
            activeTemplates.map((template) => (
              <div
                key={template.id}
                className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{typeConfig[template.type].icon}</span>
                      <p className="font-semibold">{template.name}</p>
                      <Badge className={typeConfig[template.type].color}>
                        {typeConfig[template.type].label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Objet: <span className="font-mono">{template.subject}</span>
                    </p>
                    {template.recipientCount && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {template.recipientCount} destinataire(s)
                      </p>
                    )}
                    {template.lastSent && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Dernier envoi: {new Date(template.lastSent).toLocaleDateString("fr-FR")}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedTemplate(template.id);
                        setShowPreview(true);
                      }}
                      className="gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      Aperçu
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditTemplate?.(template.id)}
                      className="gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      Éditer
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSendTemplate(template.id)}
                      className="gap-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4" />
                      Envoyer
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-8 text-muted-foreground">Aucun modèle actif</p>
          )}
        </CardContent>
      </Card>

      {/* Modèles Inactifs */}
      {inactiveTemplates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-600" />
              Modèles Inactifs
            </CardTitle>
            <CardDescription>Emails automatisés actuellement désactivés</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {inactiveTemplates.map((template) => (
              <div
                key={template.id}
                className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl opacity-50">{typeConfig[template.type].icon}</span>
                      <p className="font-semibold opacity-50">{template.name}</p>
                      <Badge variant="outline">{typeConfig[template.type].label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground opacity-50">{template.description}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleTemplate(template.id)}
                    >
                      Activer
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeleteTemplate?.(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Configuration Recommandée */}
      <Card className="border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
            <Settings className="h-5 w-5" />
            Configuration Recommandée
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-blue-700 dark:text-blue-400">
          <p>
            <strong>✓ Reçus Automatiques :</strong> Envoyés immédiatement après un paiement
          </p>
          <p>
            <strong>✓ Relances Intelligentes :</strong> 7 jours avant l'échéance, puis 1 jour après
          </p>
          <p>
            <strong>✓ Confirmations d'Événements :</strong> Envoyées 3 jours avant l'événement
          </p>
          <p>
            <strong>✓ Newsletter Mensuelle :</strong> Envoyée le 1er du mois à tous les membres
          </p>
          <p>
            <strong>✓ Alertes Administrateur :</strong> Notifications critiques en temps réel
          </p>
        </CardContent>
      </Card>

      {/* Historique d'Envoi */}
      <Card>
        <CardHeader>
          <CardTitle>Historique Récent</CardTitle>
          <CardDescription>Derniers emails envoyés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
              <div>
                <p className="font-medium text-sm">Reçus de cotisation</p>
                <p className="text-xs text-muted-foreground">Envoyés à 45 membres</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Aujourd'hui</p>
                <Badge className="bg-emerald-100 text-emerald-800 mt-1">Succès</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
              <div>
                <p className="font-medium text-sm">Relances de cotisation</p>
                <p className="text-xs text-muted-foreground">Envoyées à 12 membres</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Hier</p>
                <Badge className="bg-emerald-100 text-emerald-800 mt-1">Succès</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
              <div>
                <p className="font-medium text-sm">Confirmation d'événement</p>
                <p className="text-xs text-muted-foreground">Envoyée à 78 membres</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Il y a 2 jours</p>
                <Badge className="bg-emerald-100 text-emerald-800 mt-1">Succès</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Paramètres Globaux */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres Globaux</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <div>
              <p className="font-medium text-sm">Adresse Email Expéditeur</p>
              <p className="text-xs text-muted-foreground">noreply@lesbatisseursengages.org</p>
            </div>
            <Button size="sm" variant="outline">Modifier</Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <div>
              <p className="font-medium text-sm">Signature Email</p>
              <p className="text-xs text-muted-foreground">Incluse dans tous les emails</p>
            </div>
            <Button size="sm" variant="outline">Éditer</Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <div>
              <p className="font-medium text-sm">Notifications Administrateur</p>
              <p className="text-xs text-muted-foreground">Activées pour les alertes critiques</p>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800">Activé</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
