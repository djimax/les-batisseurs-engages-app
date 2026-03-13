import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Mail, Phone, MapPin, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";

interface MemberData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  joinDate: Date;
  cotisationStatus: "payée" | "en attente" | "en retard";
  cotisationAmount: number;
  lastPaymentDate?: Date;
  nextPaymentDate?: Date;
}

interface MemberPortalProps {
  member: MemberData;
  onDownloadReceipt?: (memberId: string) => void;
  onUpdateProfile?: (memberId: string) => void;
}

export function MemberPortal({
  member,
  onDownloadReceipt,
  onUpdateProfile,
}: MemberPortalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "payée":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "en attente":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "en retard":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "payée":
        return <CheckCircle2 className="h-5 w-5" />;
      case "en attente":
        return <AlertCircle className="h-5 w-5" />;
      case "en retard":
        return <AlertCircle className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Profil Membre */}
      <Card>
        <CardHeader>
          <CardTitle>Mon Profil</CardTitle>
          <CardDescription>Informations personnelles et adhésion</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations personnelles */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nom</p>
                <p className="text-lg font-semibold">{member.name}</p>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base">{member.email}</p>
                </div>
              </div>

              {member.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                    <p className="text-base">{member.phone}</p>
                  </div>
                </div>
              )}

              {member.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Adresse</p>
                    <p className="text-base">{member.address}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Adhérent depuis</p>
                  <p className="text-base">{new Date(member.joinDate).toLocaleDateString("fr-FR")}</p>
                </div>
              </div>
            </div>

            {/* Statut de cotisation */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-4 border border-primary/20">
                <p className="text-sm font-medium text-muted-foreground mb-2">Statut de Cotisation</p>
                <div className="flex items-center gap-2 mb-4">
                  {getStatusIcon(member.cotisationStatus)}
                  <Badge className={`${getStatusColor(member.cotisationStatus)}`}>
                    {member.cotisationStatus === "payée"
                      ? "Cotisation Payée"
                      : member.cotisationStatus === "en attente"
                      ? "En Attente"
                      : "En Retard"}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Montant annuel</p>
                    <p className="text-2xl font-bold text-primary">{member.cotisationAmount} FCFA</p>
                  </div>

                  {member.lastPaymentDate && (
                    <div>
                      <p className="text-xs text-muted-foreground">Dernier paiement</p>
                      <p className="text-sm font-semibold">
                        {new Date(member.lastPaymentDate).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  )}

                  {member.nextPaymentDate && (
                    <div>
                      <p className="text-xs text-muted-foreground">Prochain paiement</p>
                      <p className="text-sm font-semibold">
                        {new Date(member.nextPaymentDate).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <Button
              onClick={() => onDownloadReceipt?.(member.id)}
              variant="outline"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Télécharger Reçus
            </Button>
            <Button
              onClick={() => onUpdateProfile?.(member.id)}
              variant="outline"
            >
              Modifier Profil
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Historique des Cotisations */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des Cotisations</CardTitle>
          <CardDescription>Vos paiements et reçus</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucune cotisation enregistrée pour le moment.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      {member.cotisationStatus === "en retard" && (
        <Card className="border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20">
          <CardHeader>
            <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Cotisation en Retard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-700 dark:text-red-400">
              Votre cotisation est en retard. Veuillez effectuer le paiement au plus tôt pour maintenir votre adhésion active.
            </p>
            <Button className="mt-4 gap-2" variant="default">
              <Download className="h-4 w-4" />
              Payer ma Cotisation
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
