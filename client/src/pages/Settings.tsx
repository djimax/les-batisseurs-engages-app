import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SettingsIcon, LogOut, Moon, Sun, Globe, Wifi, Download, Upload, Save, DollarSign } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Settings() {
  const [, setLocation] = useLocation();
  const { logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [currency, setCurrency] = useState<'EUR' | 'CFA'>('EUR');
  const [exchangeRate, setExchangeRate] = useState('655.957');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: settings, isLoading } = trpc.globalSettings.get.useQuery();
  const updateSettings = trpc.globalSettings.update.useMutation({
    onSuccess: () => {
      toast.success('Paramètres sauvegardés');
    },
    onError: (error) => {
      toast.error('Erreur: ' + error.message);
    },
  });

  useEffect(() => {
    const savedCurrency = localStorage.getItem('currency') as 'EUR' | 'CFA' | null;
    if (savedCurrency) setCurrency(savedCurrency);
    
    const savedRate = localStorage.getItem('exchangeRate');
    if (savedRate) setExchangeRate(savedRate);
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem('currency', currency);
    localStorage.setItem('exchangeRate', exchangeRate);
    toast.success('Paramètres sauvegardés localement');
  };

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
  };

  const handleExportData = () => {
    toast.info('Fonction d\'export en développement');
  };

  const handleImportData = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos préférences et paramètres personnels
        </p>
      </div>

      {/* Paramètres de Devise */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Paramètres Financiers
          </CardTitle>
          <CardDescription>
            Configurez votre devise et les taux de change
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currency">Devise par défaut</Label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as 'EUR' | 'CFA')}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="EUR">Euro (€)</option>
                <option value="CFA">Franc CFA (F)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="exchangeRate">Taux de change (EUR → CFA)</Label>
              <input
                id="exchangeRate"
                type="number"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(e.target.value)}
                step="0.001"
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>
          </div>
          <Button onClick={handleSaveSettings} className="gap-2">
            <Save className="h-4 w-4" />
            Sauvegarder
          </Button>
        </CardContent>
      </Card>

      {/* Paramètres d'Affichage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Affichage
          </CardTitle>
          <CardDescription>
            Personnalisez l'apparence de l'application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Mode sombre</Label>
              <p className="text-sm text-muted-foreground">
                Activer le thème sombre
              </p>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              disabled
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Gérez vos préférences de notification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Notifications par email</Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des mises à jour par email
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* Données et Sauvegarde */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-4" />
            Données et Sauvegarde
          </CardTitle>
          <CardDescription>
            Gérez vos données et sauvegardes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleExportData}
            >
              <Download className="h-4 w-4" />
              Exporter les données
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleImportData}
            >
              <Upload className="h-4 w-4" />
              Importer les données
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Compte et Sécurité */}
      <Card>
        <CardHeader>
          <CardTitle>Compte et Sécurité</CardTitle>
          <CardDescription>
            Gérez votre compte et votre sécurité
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            className="gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
