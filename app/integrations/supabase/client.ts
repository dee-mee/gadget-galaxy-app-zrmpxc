import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://jvnqeobadrprqgjvyhwq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2bnFlb2JhZHJwcnFnanZ5aHdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3ODc5NzcsImV4cCI6MjA3NDM2Mzk3N30.2U0kBBDPMxUxVvK72ngdWPkZLkD-7_xvsFWnicEnUqI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
