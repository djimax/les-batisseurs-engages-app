import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Settings, CheckCircle2, AlertCircle, History, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SMSTemplate {
  id: string;
  name: string;
  message: string;
  type: "reminder" | "notification" | "alert" | "confirmation";
  recipientCount: number;
  isActive: boolean;
  lastSent?: Date;
}

interface SMSIntegrationProps {
  templates: SMSTemplate[];
  balance: number;
  onSendSMS?: (templateId: string) => void;
  onEditTemplate?: (templateId: string) => void;
  onToggleTemplate?: (templateId: string) => void;
}

const typeConfig = {
  reminder: { label: "Relance", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", icon: "🔔" },
  notification: { label: "Notification", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400", icon: "📢" },
  alert: { label: "Alerte", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", icon: "⚠️" },
  confirmation: { label: "Confirmation", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400", icon: "✓" },
};

export function SMSIntegration({
  templates,
  balance,
  onSendSMS,
  onEditTemplate,
  onToggleTemplate,
}: SMSIntegrationProps) {
  const [showComposer, setShowComposer] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const activeTemplates = templates.filter((t) => t.isActive);
  const totalRecipients = templates.reduce((sum, t) => sum + t.recipientCount, 0);
  const estimatedCost = totalRecipients * 0.05; // 0.05€ par SMS

  const handleSendSMS = (templateId: string) => {
    onSendSMS?.(templateId);
    toast.success("SMS envoyé(s) avec succès !");
  };

  const handleToggleTemplate = (templateId: string) => {
    onToggleTemplate?.(templateId);
    toast.success("Modèle mis à jour");
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Intégration SMS</h2>
        <p className="text-green-100">Envoyez des SMS de relance et de notification</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Solde SMS</p>
                <p className="text-3xl font-bold text-emerald-600">{balance}</p>
                <p className="text-xs text-muted-foreground mt-1">SMS disponibles</p>
              </div>
              <MessageSquare className="h-8 w-8 text-emerald-600/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Modèles Actifs</p>
              <p className="text-3xl font-bold text-blue-600">{activeTemplates.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Prêts à être envoyés</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Destinataires Totaux</p>
              <p className="text-3xl font-bold text-purple-600">{totalRecipients}</p>
              <p className="text-xs text-muted-foreground mt-1">~{estimatedCost.toFixed(2)}€ par envoi</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerte Solde Faible */}
      {balance < 50 && (
        <Card className="border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertCircle className="h-5 w-5" />
              Solde SMS Faible
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-700 dark:text-amber-400 mb-3">
              Vous avez moins de 50 SMS. Rechargez votre compte pour continuer à envoyer des messages.
            </p>
            <Button className="gap-2 bg-amber-600 hover:bg-amber-700">
              <Plus className="h-4 w-4" />
              Recharger le Solde
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modèles SMS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Modèles SMS Actifs
          </CardTitle>
          <CardDescription>Messages automatisés prêts à être envoyés</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeTemplates.length > 0 ? (
            activeTemplates.map((template) => (
              <div
                key={template.id}
                className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
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
                    <p className="text-sm text-muted-foreground mb-2 break-words">
                      "{template.message}"
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {template.message.length} caractères • {template.recipientCount} destinataire(s)
                    </p>
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
                      onClick={() => onEditTemplate?.(template.id)}
                      className="gap-1"
                    >
                      Éditer
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSendSMS(template.id)}
                      className="gap-1 bg-green-600 hover:bg-green-700"
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

      {/* Composer SMS */}
      <Card>
        <CardHeader>
          <CardTitle>Composer un SMS</CardTitle>
          <CardDescription>Créez et envoyez un message personnalisé</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value.slice(0, 160))}
              placeholder="Écrivez votre message (160 caractères max)..."
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3}
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                {newMessage.length}/160 caractères
              </p>
              <p className="text-xs text-muted-foreground">
                Coût estimé: {(totalRecipients * 0.05).toFixed(2)}€
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="gap-2 flex-1 bg-green-600 hover:bg-green-700">
              <Send className="h-4 w-4" />
              Envoyer à {totalRecipients} destinataire(s)
            </Button>
            <Button variant="outline" onClick={() => setNewMessage("")}>
              Annuler
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration SMS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <div>
              <p className="font-medium text-sm">Fournisseur SMS</p>
              <p className="text-xs text-muted-foreground">Twilio (Intégré)</p>
            </div>
            <Button size="sm" variant="outline">Modifier</Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <div>
              <p className="font-medium text-sm">Numéro d'Expéditeur</p>
              <p className="text-xs text-muted-foreground">+33612345678</p>
            </div>
            <Button size="sm" variant="outline">Modifier</Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <div>
              <p className="font-medium text-sm">Notifications SMS</p>
              <p className="text-xs text-muted-foreground">Alertes administrateur activées</p>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800">Activé</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Historique */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historique d'Envoi
          </CardTitle>
          <CardDescription>Derniers SMS envoyés</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded text-sm">
            <div>
              <p className="font-medium">Relance cotisations</p>
              <p className="text-xs text-muted-foreground">45 SMS envoyés</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Aujourd'hui</p>
              <Badge className="bg-emerald-100 text-emerald-800 mt-1">Succès</Badge>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded text-sm">
            <div>
              <p className="font-medium">Confirmation d'événement</p>
              <p className="text-xs text-muted-foreground">78 SMS envoyés</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Hier</p>
              <Badge className="bg-emerald-100 text-emerald-800 mt-1">Succès</Badge>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded text-sm">
            <div>
              <p className="font-medium">Notification urgente</p>
              <p className="text-xs text-muted-foreground">12 SMS envoyés</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Il y a 2 jours</p>
              <Badge className="bg-emerald-100 text-emerald-800 mt-1">Succès</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
