import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Vérifier si l'utilisateur est authentifié en vérifiant la présence d'un cookie de session
        const response = await fetch("/api/trpc/auth.me", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.result?.data) {
            setCurrentUser(data.result.data);
            setIsAuthenticated(true);
          }
        }
      } catch (e) {
        console.error("Auth check failed:", e);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await fetch("/api/trpc/auth.logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    currentUser,
    logout,
  };
}
