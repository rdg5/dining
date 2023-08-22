import { createClient } from "@supabase/supabase-js";


const supabaseUrl = "https://byfxhfmqyfwfbgylhezu.supabase.co";
const supabaseAnonPublic = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5ZnhoZm1xeWZ3ZmJneWxoZXp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTI3MTU4MDUsImV4cCI6MjAwODI5MTgwNX0.PONOQWjxmX6SOxtu_uFBeSM1IO7Mpk1OQoMzCnM-MvY';

export const supabase = createClient(supabaseUrl, supabaseAnonPublic)