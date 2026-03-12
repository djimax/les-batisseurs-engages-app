import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function SimpleLanding() {
  const handleEnter = () => {
    window.location.href = "/documents";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-blue-950 dark:via-slate-950 dark:to-blue-900 px-4">
      <div className="text-center space-y-8 max-w-2xl">
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <img src="/logo.png" alt="Les Bâtisseurs Engagés" className="h-16 w-16" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                Les Bâtisseurs Engagés
              </h1>
            </div>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Plateforme de gestion documentaire pour associations
            </p>
          </div>
        </div>

        <p className="text-lg text-slate-600 dark:text-slate-400">
          Connectez-vous pour accéder à vos documents et gérer votre association.
        </p>

      <Button
        onClick={handleEnter}
        size="lg"
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
      >
        Accéder au tableau de bord
      </Button>
      </div>
    </div>
  );
}
