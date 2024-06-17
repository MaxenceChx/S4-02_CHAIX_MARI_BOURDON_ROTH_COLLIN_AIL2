import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialisation de l'instance Supabase
const supabaseUrl = 'https://ichugcwxitnaaevoydlv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljaHVnY3d4aXRuYWFldm95ZGx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc2NzYwNDQsImV4cCI6MjAzMzI1MjA0NH0.yzdFwMIbnIF61hXD-smfyGj5sk5NjFmTtTKBbD6yK24';
const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };