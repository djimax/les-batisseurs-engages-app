import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

const SESSION_KEY = "app_session_token";
const USER_KEY = "current_user";

export function useServerAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem(SESSION_KEY);
        const savedUser = localStorage.getItem(USER_KEY);
        
        if (token && savedUser) {
          setCurrentUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error("Auth check failed:", e);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Fonction de connexion
  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError("Veuillez entrer votre email et votre mot de passe");
        return false;
      }

      // Valider le format de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Veuillez entrer une adresse email valide");
        return false;
      }

      // Appeler l'API tRPC pour se connecter
      const response = await fetch("/api/trpc/auth.login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          json: {
            email,
            password,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Erreur de connexion");
        return false;
      }

      const data = await response.json();
      
      if (data.result?.data?.success) {
        const user = data.result.data.user;
        localStorage.setItem(SESSION_KEY, "authenticated");
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        setCurrentUser(user);
        setIsAuthenticated(true);
        return true;
      } else {
        setError("Email ou mot de passe incorrect");
        return false;
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Erreur de connexion");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      await fetch("/api/trpc/auth.logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(USER_KEY);
      setIsAuthenticated(false);
      setError(null);
      setCurrentUser(null);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    error,
    currentUser,
    login,
    logout,
  };
}
