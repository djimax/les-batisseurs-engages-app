import React, { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save, CheckCircle2, AlertCircle } from "lucide-react";


interface SettingForm {
  appTitle: string;
  appDescription: string;
  appLogo: string;
  contactEmail: string;
  supportPhone: string;
  maxUploadSize: string;
}

export function AdminSettings() {
  const { data: user } = trpc.auth.me.useQuery();
  const [settings, setSettings] = useState<SettingForm>({
    appTitle: "Les Bâtisseurs Engagés",
    appDescription: "Plateforme de gestion documentaire pour associations",
    appLogo: "/logo.png",
    contactEmail: "",
    supportPhone: "",
    maxUploadSize: "50",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { data: allSettings, isLoading: settingsLoading } = trpc.adminSettings.getAll.useQuery();
  const updateSettingMutation = trpc.adminSettings.update.useMutation();

  // Load settings from database
  useEffect(() => {
    if (allSettings) {
      const settingsMap: Record<string, string> = {};
      allSettings.forEach((s) => {
        settingsMap[s.key] = s.value;
      });

      setSettings((prev) => ({
        ...prev,
        appTitle: settingsMap["appTitle"] || prev.appTitle,
        appDescription: settingsMap["appDescription"] || prev.appDescription,
        appLogo: settingsMap["appLogo"] || prev.appLogo,
        contactEmail: settingsMap["contactEmail"] || prev.contactEmail,
        supportPhone: settingsMap["supportPhone"] || prev.supportPhone,
        maxUploadSize: settingsMap["maxUploadSize"] || prev.maxUploadSize,
      }));
    }
  }, [allSettings]);

  const handleSaveSettings = async () => {
    if (!user || user.role !== "admin") {
      setErrorMessage("Vous n'avez pas les permissions pour modifier ces paramètres");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const settingsToUpdate = [
        { key: "appTitle", value: settings.appTitle, description: "Titre de l'application" },
        { key: "appDescription", value: settings.appDescription, description: "Description de l'application" },
        { key: "appLogo", value: settings.appLogo, description: "URL du logo" },
        { key: "contactEmail", value: settings.contactEmail, description: "Email de contact" },
        { key: "supportPhone", value: settings.supportPhone, description: "Téléphone de support" },
        { key: "maxUploadSize", value: settings.maxUploadSize, description: "Taille maximale d'upload en MB" },
      ];

      for (const setting of settingsToUpdate) {
        await updateSettingMutation.mutateAsync({
          key: setting.key,
          value: setting.value,
          description: setting.description,
        });
      }

      setSuccessMessage("Tous les paramètres ont été sauvegardés avec succès !");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erreur lors de la sauvegarde des paramètres"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (settingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Vous n'avez pas les permissions pour accéder à cette page. Seuls les administrateurs peuvent modifier les paramètres globaux.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Paramètres Globaux</h1>
        <p className="text-muted-foreground">
          Gérez les paramètres de configuration de l'application
        </p>
      </div>

      <div className="grid gap-6">
        {/* Messages */}
        {successMessage && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Application Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informations de l'Application</CardTitle>
            <CardDescription>
              Configurez les informations de base de votre application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Titre de l'Application</label>
              <Input
                placeholder="Ex: Les Bâtisseurs Engagés"
                value={settings.appTitle}
                onChange={(e) => setSettings({ ...settings, appTitle: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                placeholder="Description courte de l'application"
                value={settings.appDescription}
                onChange={(e) => setSettings({ ...settings, appDescription: e.target.value })}
                disabled={isLoading}
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">URL du Logo</label>
              <Input
                placeholder="Ex: /logo.png"
                value={settings.appLogo}
                onChange={(e) => setSettings({ ...settings, appLogo: e.target.value })}
                disabled={isLoading}
              />
              {settings.appLogo && (
                <div className="mt-2 p-4 bg-muted rounded-lg flex items-center justify-center">
                  <img src={settings.appLogo} alt="Logo" className="h-16 object-contain" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informations de Contact</CardTitle>
            <CardDescription>
              Configurez les coordonnées de support
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email de Contact</label>
              <Input
                type="email"
                placeholder="contact@example.com"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Téléphone de Support</label>
              <Input
                placeholder="+33 1 23 45 67 89"
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Technical Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Paramètres Techniques</CardTitle>
            <CardDescription>
              Configurez les paramètres techniques de l'application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Taille Maximale d'Upload (MB)
              </label>
              <Input
                type="number"
                placeholder="50"
                value={settings.maxUploadSize}
                onChange={(e) => setSettings({ ...settings, maxUploadSize: e.target.value })}
                disabled={isLoading}
                min="1"
                max="500"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Taille maximale autorisée pour les uploads de fichiers
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex gap-2">
          <Button
            onClick={handleSaveSettings}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sauvegarde en cours...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder les Paramètres
              </>
            )}
          </Button>
        </div>

        {/* Info Box */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-900">
              <strong>ℹ️ Information:</strong> Toutes les modifications seront enregistrées dans l'historique d'audit. Seuls les administrateurs peuvent modifier ces paramètres.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminSettings;
