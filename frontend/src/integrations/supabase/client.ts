import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const SUPABASE_URL = "https://pgxhwkifayptucnkjcpk.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBneGh3aWZhYXlwdHVjbmtqY3BrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgzNTczNzIsImV4cCI6MjA1MzkzMzM3Mn0.9kZa_kcq7j7v7gKwNNT_8M5Cf0N6T3qDO2o-7yEz2oc"

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)