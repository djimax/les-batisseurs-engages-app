import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X, CheckCircle2, AlertCircle, Info, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "success" | "warning" | "info" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead?: (notificationId: string) => void;
  onDelete?: (notificationId: string) => void;
  onEnablePushNotifications?: () => void;
}

export function NotificationCenter({
  notifications,
  onMarkAsRead,
  onDelete,
  onEnablePushNotifications,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-600" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-900/50";
      case "warning":
        return "bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-900/50";
      case "error":
        return "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-900/50";
      case "info":
      default:
        return "bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-900/50";
    }
  };

  const handleEnablePushNotifications = async () => {
    try {
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          setPushEnabled(true);
          toast.success("Notifications push activées !");
        } else if (Notification.permission !== "denied") {
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            setPushEnabled(true);
            toast.success("Notifications push activées !");
            onEnablePushNotifications?.();
          }
        }
      } else {
        toast.error("Les notifications ne sont pas supportées par votre navigateur");
      }
    } catch (error) {
      console.error("Erreur lors de l'activation des notifications:", error);
      toast.error("Erreur lors de l'activation des notifications");
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    onMarkAsRead?.(notificationId);
  };

  const handleDelete = (notificationId: string) => {
    onDelete?.(notificationId);
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Bouton Notification avec Badge */}
      <div className="relative">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          size="icon"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Panneau des Notifications */}
      {isOpen && (
        <Card className="w-full md:w-96 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Activation des notifications push */}
            {!pushEnabled && (
              <Button
                onClick={handleEnablePushNotifications}
                className="w-full gap-2"
                variant="outline"
                size="sm"
              >
                <Bell className="h-4 w-4" />
                Activer les Notifications Push
              </Button>
            )}

            {/* Liste des notifications */}
            {notifications.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${getTypeColor(notification.type)} ${
                      !notification.read ? "font-semibold" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {getIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(notification.timestamp).toLocaleTimeString("fr-FR")}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 flex-shrink-0"
                        onClick={() => handleDelete(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>

                    {!notification.read && (
                      <Button
                        onClick={() => handleMarkAsRead(notification.id)}
                        size="sm"
                        variant="outline"
                        className="w-full mt-2 text-xs"
                      >
                        Marquer comme lue
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Aucune notification</p>
              </div>
            )}

            {notifications.length > 5 && (
              <Button
                variant="outline"
                className="w-full"
                size="sm"
              >
                Voir toutes les notifications
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Panneau de Gestion des Préférences */}
      <Card>
        <CardHeader>
          <CardTitle>Préférences de Notifications</CardTitle>
          <CardDescription>Gérez vos alertes et notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div>
                <p className="font-medium text-sm">Notifications Push</p>
                <p className="text-xs text-muted-foreground">Recevoir des alertes sur votre appareil</p>
              </div>
              <Badge className={pushEnabled ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"}>
                {pushEnabled ? "Activé" : "Désactivé"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div>
                <p className="font-medium text-sm">Relances de Cotisations</p>
                <p className="text-xs text-muted-foreground">Alertes pour les cotisations en retard</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800">Activé</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div>
                <p className="font-medium text-sm">Événements Importants</p>
                <p className="text-xs text-muted-foreground">Rappels pour les réunions et événements</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800">Activé</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div>
                <p className="font-medium text-sm">Alertes Financières</p>
                <p className="text-xs text-muted-foreground">Notifications sur les mouvements importants</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800">Activé</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
