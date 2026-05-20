import "server-only";

export type SupabaseServerConfig = {
  url: string;
  serviceRoleKey: string;
};

export function readSupabaseServerConfig(): SupabaseServerConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { url, serviceRoleKey };
}

export function getSupabaseServerConfig(): SupabaseServerConfig {
  const config = readSupabaseServerConfig();

  if (!config) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return config;
}
