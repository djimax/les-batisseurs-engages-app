export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL || window.location.origin;
  const appId = import.meta.env.VITE_APP_ID || "les-batisseurs-engages-app";
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  // Ensure oauthPortalUrl is a valid URL
  if (!oauthPortalUrl || oauthPortalUrl === "undefined") {
    console.warn("VITE_OAUTH_PORTAL_URL not configured, using window.location.origin");
    return window.location.origin;
  }

  try {
    const url = new URL(`${oauthPortalUrl}/app-auth`);
    url.searchParams.set("appId", appId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");
    return url.toString();
  } catch (error) {
    console.error("Error creating login URL:", error);
    return window.location.origin;
  }
};

// Get API URL for backend calls
export const getApiUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || window.location.origin;
  if (!apiUrl || apiUrl === "undefined") {
    return window.location.origin;
  }
  return apiUrl;
};
