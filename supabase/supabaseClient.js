// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rwdmepszjcgdaecezzhc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3ZG1lcHN6amNnZGFlY2V6emhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAwMTM0NzMsImV4cCI6MjAzNTU4OTQ3M30.BYiebp1mo3eulvWWXhr8P8M9h-MDbbjKSw8qqKDzHGw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
