import { createClient } from '@supabase/supabase-js';

// Using provided credentials
const supabaseUrl = 'https://bfsjpfkwolflniqezbqi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmc2pwZmt3b2xmbG5pcWV6YnFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2Njc1MjAsImV4cCI6MjA4MDI0MzUyMH0.ga4rF3yAaWJYsUNl6NGnI4amaWgRF7PiviytnUgySVU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);