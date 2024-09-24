// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xsivkztilwbumtbhhdio.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzaXZrenRpbHdidW10YmhoZGlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcxNzI3ODUsImV4cCI6MjA0Mjc0ODc4NX0.Sg1BoiFDdmpByrJJiaOTq5A9EoTb2NlEa5_fHavQFXY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
