import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@shared/auth-schemas";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { Loader2, AlertCircle, Lock, Mail, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => {
      toast.success("Connexion réussie !");
      // Rediriger vers la page d'accueil
      setLocation("/");
      // Recharger la page pour mettre à jour l'authentification
      setTimeout(() => window.location.reload(), 500);
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la connexion");
    },
  });

  async function onSubmit(data: LoginInput) {
    setIsLoading(true);
    try {
      await loginMutation.mutateAsync(data);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-blue-950 dark:via-slate-950 dark:to-blue-900 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 dark:bg-blue-900/30 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 dark:bg-blue-800/30 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95 dark:bg-slate-900/95">
          <CardHeader className="space-y-4 text-center pb-8">
            <div className="flex justify-center mb-4 animate-fade-in-up">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <img src="/logo.png" alt="Les Bâtisseurs Engagés" className="h-12 w-12" />
              </div>
            </div>
            <div className="space-y-2 animate-fade-in-up delay-1">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  Les Bâtisseurs Engagés
                </CardTitle>
              </div>
              <CardDescription className="text-base">
                Plateforme de gestion d'association
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="animate-fade-in-up delay-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {form.formState.errors.email || form.formState.errors.password ? (
                  <Alert variant="destructive" className="animate-fade-in-up">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {form.formState.errors.email?.message || form.formState.errors.password?.message}
                    </AlertDescription>
                  </Alert>
                ) : null}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Adresse Email</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500 group-focus-within:text-blue-600 transition-colors" />
                          <Input
                            placeholder="admin@batisseurs-engages.fr"
                            type="email"
                            disabled={isLoading}
                            className="pl-10 h-11 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-500 transition-all"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500 group-focus-within:text-blue-600 transition-colors" />
                          <Input
                            placeholder="••••••••"
                            type="password"
                            disabled={isLoading}
                            className="pl-10 h-11 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-500 transition-all"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
            </Form>

            <div className="mt-8 pt-6 border-t border-blue-100 dark:border-blue-900">
              <p className="text-xs text-center text-muted-foreground leading-relaxed mb-3">
                Identifiants de test :
              </p>
              <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg text-xs font-mono">
                <p><strong>Email :</strong> admin@batisseurs-engages.fr</p>
                <p><strong>Mot de passe :</strong> Admin123!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>Version 1.0 • Plateforme sécurisée</p>
        </div>
      </div>
    </div>
  );
}
