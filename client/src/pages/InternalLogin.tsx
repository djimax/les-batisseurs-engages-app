import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { Loader2, AlertCircle, Lock, Mail, Sparkles, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Comptes de test prédéfinis pour l'association
const INTERNAL_ACCOUNTS = [
  {
    email: "president@batisseurs-engages.fr",
    password: "President123!",
    name: "Président",
    role: "admin",
  },
  {
    email: "tresorier@batisseurs-engages.fr",
    password: "Tresorier123!",
    name: "Trésorier",
    role: "treasurer",
  },
  {
    email: "secretaire@batisseurs-engages.fr",
    password: "Secretaire123!",
    name: "Secrétaire",
    role: "secretary",
  },
  {
    email: "admin@batisseurs-engages.fr",
    password: "Admin123!",
    name: "Administrateur",
    role: "admin",
  },
];

export default function InternalLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Vérifier les identifiants
    const user = INTERNAL_ACCOUNTS.find(
      (acc) => acc.email === email && acc.password === password
    );

    if (user) {
      // Sauvegarder l'utilisateur en session
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          email: user.email,
          name: user.name,
          role: user.role,
        })
      );
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: user.email,
          name: user.name,
          role: user.role,
        })
      );

      toast.success(`Bienvenue ${user.name} !`);
      setTimeout(() => {
        setLocation("/");
        window.location.reload();
      }, 500);
    } else {
      setError("Email ou mot de passe incorrect");
      toast.error("Identifiants invalides");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-blue-950 dark:via-slate-950 dark:to-blue-900 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 dark:bg-blue-900/30 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 dark:bg-blue-800/30 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95 dark:bg-slate-900/95">
          <CardHeader className="space-y-4 text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <img src="/logo.png" alt="Les Bâtisseurs Engagés" className="h-12 w-12" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  Les Bâtisseurs Engagés
                </CardTitle>
              </div>
              <CardDescription className="text-base">
                Portail de Gestion Interne
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="animate-fade-in-up">
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <Alert variant="destructive" className="animate-fade-in-up">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                  Adresse Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500 group-focus-within:text-blue-600 transition-colors" />
                  <Input
                    placeholder="president@batisseurs-engages.fr"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="pl-10 h-11 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                  Mot de passe
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500 group-focus-within:text-blue-600 transition-colors" />
                  <Input
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="pl-10 pr-10 h-11 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-500 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Connexion en cours...
                  </div>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-blue-100 dark:border-blue-900">
              <p className="text-xs text-center text-muted-foreground leading-relaxed mb-4 font-semibold">
                👥 Comptes de Test Disponibles :
              </p>
              <div className="space-y-2 text-xs">
                {INTERNAL_ACCOUNTS.map((account) => (
                  <div
                    key={account.email}
                    className="bg-blue-50 dark:bg-blue-950/30 p-2 rounded-lg font-mono hover:bg-blue-100 dark:hover:bg-blue-950/50 cursor-pointer transition-colors"
                    onClick={() => {
                      setEmail(account.email);
                      setPassword(account.password);
                    }}
                  >
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>{account.name}</strong>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {account.email}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>Version 1.0 • Plateforme Sécurisée pour Gestion Interne</p>
        </div>
      </div>
    </div>
  );
}
