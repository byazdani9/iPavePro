import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://dsvgoyeyhjahefrlipjy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzdmdveWV5aGphaGVmcmxpcGp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2NzE1NjgsImV4cCI6MjA1NzI0NzU2OH0.VvwsjG58P6tmiHau7NGqf4zKWEESoa6o7noI1FhENhc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
