import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Shield, Mail, Phone, CheckCircle2, AlertCircle, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "president" | "treasurer" | "secretary" | "member";
  status: "active" | "inactive" | "suspended";
  joinDate: Date;
  lastLogin?: Date;
  permissions: string[];
}

interface UserManagementProps {
  users: User[];
  onAddUser?: () => void;
  onEditUser?: (userId: string) => void;
  onDeleteUser?: (userId: string) => void;
  onChangeRole?: (userId: string, role: string) => void;
  onResetPassword?: (userId: string) => void;
}

const roleConfig = {
  admin: { label: "Administrateur", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", icon: "🔧" },
  president: { label: "Président", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", icon: "👨‍💼" },
  treasurer: { label: "Trésorier", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400", icon: "💰" },
  secretary: { label: "Secrétaire", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400", icon: "📋" },
  member: { label: "Membre", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400", icon: "👤" },
};

const statusConfig = {
  active: { label: "Actif", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400", icon: "✓" },
  inactive: { label: "Inactif", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400", icon: "−" },
  suspended: { label: "Suspendu", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", icon: "!" },
};

export function UserManagement({
  users,
  onAddUser,
  onEditUser,
  onDeleteUser,
  onChangeRole,
  onResetPassword,
}: UserManagementProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const filteredUsers = selectedRole
    ? users.filter((u) => u.role === selectedRole)
    : users;

  const handleDeleteUser = (userId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      onDeleteUser?.(userId);
      toast.success("Utilisateur supprimé");
    }
  };

  const handleResetPassword = (userId: string) => {
    onResetPassword?.(userId);
    toast.success("Email de réinitialisation envoyé");
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Gestion des Utilisateurs</h2>
        <p className="text-slate-100">Gérez les accès et les permissions</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{users.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Utilisateurs totaux</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600">
                {users.filter((u) => u.status === "active").length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Actifs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-600">
                {users.filter((u) => u.status === "inactive").length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Inactifs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {users.filter((u) => u.status === "suspended").length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Suspendus</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bouton Ajouter */}
      <Button onClick={onAddUser} className="gap-2" size="lg">
        <Plus className="h-4 w-4" />
        Ajouter un Utilisateur
      </Button>

      {/* Filtres par Rôle */}
      <Card>
        <CardHeader>
          <CardTitle>Filtrer par Rôle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setSelectedRole(null)}
              variant={selectedRole === null ? "default" : "outline"}
            >
              Tous
            </Button>
            {Object.entries(roleConfig).map(([role, config]) => (
              <Button
                key={role}
                onClick={() => setSelectedRole(role)}
                variant={selectedRole === role ? "default" : "outline"}
                className="gap-1"
              >
                {config.icon} {config.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Liste des Utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs ({filteredUsers.length})</CardTitle>
          <CardDescription>
            {selectedRole ? `Affichage des ${roleConfig[selectedRole as keyof typeof roleConfig]?.label}s` : "Tous les utilisateurs"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold">{user.name}</p>
                        <Badge className={roleConfig[user.role].color}>
                          {roleConfig[user.role].icon} {roleConfig[user.role].label}
                        </Badge>
                        <Badge className={statusConfig[user.status].color}>
                          {statusConfig[user.status].label}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {user.phone}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Adhérent depuis {new Date(user.joinDate).toLocaleDateString("fr-FR")}
                        </div>
                        {user.lastLogin && (
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Dernière connexion: {new Date(user.lastLogin).toLocaleDateString("fr-FR")}
                          </div>
                        )}
                      </div>

                      {user.permissions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {user.permissions.slice(0, 3).map((perm) => (
                            <Badge key={perm} variant="outline" className="text-xs">
                              {perm}
                            </Badge>
                          ))}
                          {user.permissions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{user.permissions.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditUser?.(user.id)}
                        className="gap-1"
                      >
                        <Edit className="h-4 w-4" />
                        Éditer
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResetPassword(user.id)}
                        className="gap-1"
                      >
                        <Lock className="h-4 w-4" />
                        Réinitialiser
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteUser(user.id)}
                        className="gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-muted-foreground">Aucun utilisateur</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Gestion des Rôles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gestion des Rôles
          </CardTitle>
          <CardDescription>Permissions et responsabilités</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(roleConfig).map(([role, config]) => (
            <div key={role} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{config.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {role === "admin" && "Accès complet au système"}
                    {role === "president" && "Vue d'ensemble et rapports"}
                    {role === "treasurer" && "Gestion financière complète"}
                    {role === "secretary" && "Gestion des documents et événements"}
                    {role === "member" && "Accès limité aux informations"}
                  </p>
                </div>
                <Button size="sm" variant="outline">Configurer</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
