import { createClient } from "@supabase/supabase-js";

const viteEnv = (import.meta as ImportMeta & {
  env: {
    VITE_SUPABASE_URL: string;
    VITE_SUPABASE_PUBLISHABLE_KEY: string;
  };
}).env;

const supabaseUrl = viteEnv.VITE_SUPABASE_URL;
const supabasePublishableKey = viteEnv.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);