import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Users, Bell, CheckCircle2, Clock, Plus, Download } from "lucide-react";

interface DashboardSecretaryProps {
  upcomingEvents: number;
  documentsToReview: number;
  totalMembers: number;
  pendingAnnouncements: number;
  recentDocuments: Array<{ id: string; name: string; date: Date; type: string }>;
  upcomingMeetings: Array<{ id: string; name: string; date: Date; attendees: number }>;
}

export function DashboardSecretary({
  upcomingEvents,
  documentsToReview,
  totalMembers,
  pendingAnnouncements,
  recentDocuments,
  upcomingMeetings,
}: DashboardSecretaryProps) {
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Tableau de Bord Secrétaire</h2>
        <p className="text-blue-100">Gestion des documents et événements</p>
      </div>

      {/* KPI Principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Événements à Venir</p>
                <p className="text-3xl font-bold text-blue-600">{upcomingEvents}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Documents à Réviser</p>
                <p className="text-3xl font-bold text-amber-600">{documentsToReview}</p>
              </div>
              <FileText className="h-8 w-8 text-amber-600/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Membres à Contacter</p>
                <p className="text-3xl font-bold text-emerald-600">{totalMembers}</p>
              </div>
              <Users className="h-8 w-8 text-emerald-600/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Annonces en Attente</p>
                <p className="text-3xl font-bold text-purple-600">{pendingAnnouncements}</p>
              </div>
              <Bell className="h-8 w-8 text-purple-600/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Réunions à Venir */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Réunions à Venir
          </CardTitle>
          <CardDescription>Prochaines réunions et événements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingMeetings.length > 0 ? (
            upcomingMeetings.map((meeting) => (
              <div key={meeting.id} className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold">{meeting.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(meeting.date).toLocaleDateString("fr-FR")} à {new Date(meeting.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{meeting.attendees} participants attendus</p>
                  </div>
                  <Button size="sm" variant="outline">Détails</Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-6 text-muted-foreground">Aucune réunion prévue</p>
          )}
          <Button className="w-full gap-2" variant="outline">
            <Plus className="h-4 w-4" />
            Planifier une Réunion
          </Button>
        </CardContent>
      </Card>

      {/* Documents Récents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber-600" />
            Documents Récents
          </CardTitle>
          <CardDescription>Fichiers et documents importants</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentDocuments.length > 0 ? (
            recentDocuments.map((doc) => (
              <div key={doc.id} className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(doc.date).toLocaleDateString("fr-FR")}
                    </p>
                    <Badge className="mt-2 bg-blue-100 text-blue-800">{doc.type}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Voir</Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-6 text-muted-foreground">Aucun document</p>
          )}
          <Button className="w-full gap-2" variant="outline">
            <Plus className="h-4 w-4" />
            Ajouter un Document
          </Button>
        </CardContent>
      </Card>

      {/* Tâches Prioritaires */}
      <Card className="border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20">
        <CardHeader>
          <CardTitle className="text-amber-700 dark:text-amber-400">Tâches Prioritaires</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 p-2">
            <CheckCircle2 className="h-4 w-4 text-amber-600" />
            <span className="text-sm">Préparer l'ordre du jour de la réunion du 20 mars</span>
          </div>
          <div className="flex items-center gap-2 p-2">
            <Clock className="h-4 w-4 text-amber-600" />
            <span className="text-sm">Envoyer les convocations aux membres</span>
          </div>
          <div className="flex items-center gap-2 p-2">
            <FileText className="h-4 w-4 text-amber-600" />
            <span className="text-sm">Finaliser le procès-verbal de la dernière réunion</span>
          </div>
        </CardContent>
      </Card>

      {/* Actions Rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Créer Événement
            </Button>
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Nouveau Document
            </Button>
            <Button variant="outline" className="gap-2">
              <Bell className="h-4 w-4" />
              Publier Annonce
            </Button>
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              Envoyer Email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
