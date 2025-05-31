// Supabase configuration
const SUPABASE_CONFIG = {
    url: 'https://zivunqqfxbrzabjinrjz.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppdnVucXFmeGJyemFiamlucmp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NDc1MTQsImV4cCI6MjA2NDIyMzUxNH0.SGl6KzqMkE3YBKafC_H2fk2GL9m1J4uP15Ivise4YNE'
};

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey); 