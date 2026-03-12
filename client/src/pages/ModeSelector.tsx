import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cloud, Wifi, Building2, Globe, Zap } from "lucide-react";

interface ModeSelectorProps {
  onSelectMode: (mode: 'online' | 'offline') => void;
}

export default function ModeSelector({ onSelectMode }: ModeSelectorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10 p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="Les Batisseurs Engages" className="w-24 h-24 object-contain" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Les Bâtisseurs Engagés</h1>
          <p className="text-lg text-muted-foreground">
            Plateforme de gestion documentaire pour associations
          </p>
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Online Mode */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Cloud className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Mode En Ligne</CardTitle>
              </div>
              <CardDescription>
                Accès depuis n'importe où avec synchronisation cloud
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">✨ Avantages :</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✅ Accès depuis n'importe quel ordinateur</li>
                  <li>✅ Données synchronisées en temps réel</li>
                  <li>✅ Stockage illimité dans le cloud</li>
                  <li>✅ Partage facile entre membres</li>
                  <li>✅ Sauvegarde automatique</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">⚠️ Requis :</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Connexion Internet</li>
                  <li>• Compte Manus</li>
                </ul>
              </div>
              <Button
                onClick={() => onSelectMode('online')}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <Globe className="w-4 h-4 mr-2" />
                Utiliser Mode En Ligne
              </Button>
            </CardContent>
          </Card>

          {/* Offline Mode */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Mode Hors Ligne</CardTitle>
              </div>
              <CardDescription>
                Utilisez l'application sans connexion Internet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">✨ Avantages :</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✅ Aucune connexion Internet requise</li>
                  <li>✅ Données stockées localement</li>
                  <li>✅ Utilisation immédiate</li>
                  <li>✅ Pas d'authentification</li>
                  <li>✅ Parfait pour les réunions offline</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">⚠️ Limitations :</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Données locales uniquement</li>
                  <li>• Pas de synchronisation</li>
                </ul>
              </div>
              <Button
                onClick={() => onSelectMode('offline')}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <Wifi className="w-4 h-4 mr-2" />
                Utiliser Mode Hors Ligne
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="text-2xl">ℹ️</div>
              <div>
                <p className="font-semibold text-blue-900 mb-1">Vous pouvez changer de mode à tout moment</p>
                <p className="text-sm text-blue-800">
                  Vous pouvez passer du mode en ligne au mode hors ligne (et vice versa) en cliquant sur le sélecteur de mode dans les paramètres.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
