-- Create OpenAI cache table
CREATE TABLE IF NOT EXISTS openai_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cache_key TEXT NOT NULL UNIQUE,
  operation_type TEXT NOT NULL CHECK (operation_type IN ('chat', 'visa_recommendations', 'dream_action_plan')),
  input_hash TEXT NOT NULL,
  input_data JSONB NOT NULL,
  response_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  hit_count INTEGER DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_openai_cache_operation_type ON openai_cache(operation_type);
CREATE INDEX IF NOT EXISTS idx_openai_cache_expires_at ON openai_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_openai_cache_input_hash ON openai_cache(input_hash);
CREATE INDEX IF NOT EXISTS idx_openai_cache_hit_count ON openai_cache(hit_count DESC);
CREATE INDEX IF NOT EXISTS idx_openai_cache_last_accessed ON openai_cache(last_accessed DESC);

-- Create composite index for common queries
CREATE INDEX IF NOT EXISTS idx_openai_cache_operation_expires ON openai_cache(operation_type, expires_at);

-- Add RLS (Row Level Security) policies
ALTER TABLE openai_cache ENABLE ROW LEVEL SECURITY;

-- Policy to allow all authenticated users to read cache
CREATE POLICY "Allow authenticated users to read cache" ON openai_cache
  FOR SELECT TO authenticated USING (true);

-- Policy to allow all authenticated users to insert cache
CREATE POLICY "Allow authenticated users to insert cache" ON openai_cache
  FOR INSERT TO authenticated WITH CHECK (true);

-- Policy to allow all authenticated users to update cache
CREATE POLICY "Allow authenticated users to update cache" ON openai_cache
  FOR UPDATE TO authenticated USING (true);

-- Policy to allow all authenticated users to delete expired cache
CREATE POLICY "Allow authenticated users to delete expired cache" ON openai_cache
  FOR DELETE TO authenticated USING (expires_at < NOW());

-- Function to automatically clean up expired cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM openai_cache WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run cleanup daily (requires pg_cron extension)
-- Note: This requires the pg_cron extension to be enabled in Supabase
-- SELECT cron.schedule('cleanup-expired-cache', '0 2 * * *', 'SELECT cleanup_expired_cache();');
