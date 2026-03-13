import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Send, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface CotisationReminder {
  memberId: string;
  memberName: string;
  email: string;
  daysUntilDue: number;
  cotisationAmount: number;
  dueDate: Date;
  status: "upcoming" | "overdue" | "paid";
}

interface CotisationRemindersProps {
  reminders: CotisationReminder[];
  onSendReminder?: (memberId: string) => void;
  onSendBulkReminders?: () => void;
}

export function CotisationReminders({
  reminders,
  onSendReminder,
  onSendBulkReminders,
}: CotisationRemindersProps) {
  const upcomingReminders = reminders.filter((r) => r.status === "upcoming");
  const overdueReminders = reminders.filter((r) => r.status === "overdue");
  const paidReminders = reminders.filter((r) => r.status === "paid");

  const handleSendReminder = (memberId: string) => {
    onSendReminder?.(memberId);
    toast.success("Relance envoyée avec succès !");
  };

  const handleSendBulkReminders = () => {
    onSendBulkReminders?.();
    toast.success(`${upcomingReminders.length + overdueReminders.length} relances envoyées !`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "upcoming":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="h-4 w-4" />;
      case "upcoming":
        return <Calendar className="h-4 w-4" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid":
        return "Payée";
      case "upcoming":
        return "À venir";
      case "overdue":
        return "En retard";
      default:
        return "Inconnu";
    }
  };

  return (
    <div className="space-y-6">
      {/* Résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-600">{upcomingReminders.length}</p>
              <p className="text-sm text-muted-foreground">Cotisations à venir</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">{overdueReminders.length}</p>
              <p className="text-sm text-muted-foreground">Cotisations en retard</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600">{paidReminders.length}</p>
              <p className="text-sm text-muted-foreground">Cotisations payées</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bouton d'envoi en masse */}
      {(upcomingReminders.length > 0 || overdueReminders.length > 0) && (
        <Button
          onClick={handleSendBulkReminders}
          className="w-full gap-2"
          size="lg"
        >
          <Send className="h-4 w-4" />
          Envoyer les Relances ({upcomingReminders.length + overdueReminders.length})
        </Button>
      )}

      {/* Cotisations en Retard */}
      {overdueReminders.length > 0 && (
        <Card className="border-red-200 dark:border-red-900/50">
          <CardHeader>
            <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Cotisations en Retard
            </CardTitle>
            <CardDescription>
              {overdueReminders.length} membre(s) avec cotisation en retard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overdueReminders.map((reminder) => (
                <div
                  key={reminder.memberId}
                  className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900/50"
                >
                  <div className="flex-1">
                    <p className="font-semibold">{reminder.memberName}</p>
                    <p className="text-sm text-muted-foreground">
                      {reminder.cotisationAmount} FCFA - Échéance: {new Date(reminder.dueDate).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleSendReminder(reminder.memberId)}
                    size="sm"
                    variant="outline"
                    className="gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Relancer
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cotisations à Venir */}
      {upcomingReminders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-amber-600" />
              Cotisations à Venir
            </CardTitle>
            <CardDescription>
              {upcomingReminders.length} membre(s) avec cotisation prochainement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingReminders.map((reminder) => (
                <div
                  key={reminder.memberId}
                  className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900/50"
                >
                  <div className="flex-1">
                    <p className="font-semibold">{reminder.memberName}</p>
                    <p className="text-sm text-muted-foreground">
                      {reminder.cotisationAmount} FCFA - Échéance dans {reminder.daysUntilDue} jour(s)
                    </p>
                  </div>
                  <Button
                    onClick={() => handleSendReminder(reminder.memberId)}
                    size="sm"
                    variant="outline"
                    className="gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Rappeler
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cotisations Payées */}
      {paidReminders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              Cotisations Payées
            </CardTitle>
            <CardDescription>
              {paidReminders.length} membre(s) à jour de cotisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {paidReminders.slice(0, 5).map((reminder) => (
                <div
                  key={reminder.memberId}
                  className="flex items-center justify-between p-2 text-sm"
                >
                  <span>{reminder.memberName}</span>
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                    Payée
                  </Badge>
                </div>
              ))}
              {paidReminders.length > 5 && (
                <p className="text-sm text-muted-foreground pt-2">
                  +{paidReminders.length - 5} autre(s)
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message vide */}
      {reminders.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucune cotisation à gérer pour le moment.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
