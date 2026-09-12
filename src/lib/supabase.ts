import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://ybkqxqbblqikthbolfmn.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjVkZDBlMjk0LWVkNWItNDBhZC1iZTg4LTllMjYxMTQ5MjQyMiJ9.eyJwcm9qZWN0SWQiOiJ5YmtxeHFiYmxxaWt0aGJvbGZtbiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzgyMTg2MDQ3LCJleHAiOjIwOTc1NDYwNDcsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.aWSnjcF1buEOo0LM8niwb8IvoaaVOULPD3ZXb6Y304k';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };