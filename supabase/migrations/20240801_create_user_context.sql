-- Create user contexts table for storing JSON context data
CREATE TABLE IF NOT EXISTS user_contexts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  context_id TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Core context data stored as JSONB for efficient querying
  profile JSONB NOT NULL DEFAULT '{}',
  immigration_goals JSONB NOT NULL DEFAULT '{}',
  current_situation JSONB NOT NULL DEFAULT '{}',
  dream_goals JSONB NOT NULL DEFAULT '[]',
  visa_analyses JSONB NOT NULL DEFAULT '[]',
  specialist_interactions JSONB NOT NULL DEFAULT '[]',
  progress_tracking JSONB NOT NULL DEFAULT '{}',
  ai_insights JSONB NOT NULL DEFAULT '{}',
  
  -- Metadata
  data_completeness_score INTEGER DEFAULT 0 CHECK (data_completeness_score >= 0 AND data_completeness_score <= 100),
  last_specialist_review TIMESTAMP WITH TIME ZONE,
  next_review_due TIMESTAMP WITH TIME ZONE,
  privacy_settings JSONB NOT NULL DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  notes TEXT[] DEFAULT '{}'
);

-- Create user context history table for tracking changes
CREATE TABLE IF NOT EXISTS user_context_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  context_id TEXT,
  operation TEXT NOT NULL CHECK (operation IN ('create', 'update', 'append', 'delete')),
  section TEXT NOT NULL,
  data JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source TEXT NOT NULL CHECK (source IN ('user', 'system', 'specialist', 'ai')),
  reason TEXT,
  
  -- Reference to the context
  FOREIGN KEY (context_id) REFERENCES user_contexts(context_id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_contexts_user_id ON user_contexts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_contexts_context_id ON user_contexts(context_id);
CREATE INDEX IF NOT EXISTS idx_user_contexts_updated_at ON user_contexts(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_contexts_completeness ON user_contexts(data_completeness_score DESC);
CREATE INDEX IF NOT EXISTS idx_user_contexts_last_accessed ON user_contexts(last_accessed DESC);

-- Indexes for JSONB fields for efficient querying
CREATE INDEX IF NOT EXISTS idx_user_contexts_profile_name ON user_contexts USING GIN ((profile->>'name'));
CREATE INDEX IF NOT EXISTS idx_user_contexts_profile_profession ON user_contexts USING GIN ((profile->>'profession'));
CREATE INDEX IF NOT EXISTS idx_user_contexts_goals_category ON user_contexts USING GIN ((immigration_goals->>'category'));
CREATE INDEX IF NOT EXISTS idx_user_contexts_goals_priority ON user_contexts USING GIN ((immigration_goals->>'priority'));

-- History table indexes
CREATE INDEX IF NOT EXISTS idx_user_context_history_user_id ON user_context_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_context_history_context_id ON user_context_history(context_id);
CREATE INDEX IF NOT EXISTS idx_user_context_history_timestamp ON user_context_history(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_user_context_history_operation ON user_context_history(operation);
CREATE INDEX IF NOT EXISTS idx_user_context_history_source ON user_context_history(source);

-- Add RLS (Row Level Security) policies
ALTER TABLE user_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_context_history ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read their own context
CREATE POLICY "Users can read own context" ON user_contexts
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Policy to allow users to insert their own context
CREATE POLICY "Users can insert own context" ON user_contexts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own context
CREATE POLICY "Users can update own context" ON user_contexts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Policy to allow users to delete their own context
CREATE POLICY "Users can delete own context" ON user_contexts
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- History table policies
CREATE POLICY "Users can read own context history" ON user_context_history
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own context history" ON user_context_history
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_context_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at on context changes
CREATE TRIGGER trigger_update_user_context_updated_at
  BEFORE UPDATE ON user_contexts
  FOR EACH ROW
  EXECUTE FUNCTION update_user_context_updated_at();

-- Function to calculate data completeness score
CREATE OR REPLACE FUNCTION calculate_context_completeness(context_data user_contexts)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
  max_score INTEGER := 100;
BEGIN
  -- Profile completeness (30 points)
  IF context_data.profile->>'name' IS NOT NULL AND LENGTH(TRIM(context_data.profile->>'name')) > 0 THEN
    score := score + 5;
  END IF;
  
  IF context_data.profile->>'age' IS NOT NULL AND (context_data.profile->>'age')::INTEGER > 0 THEN
    score := score + 3;
  END IF;
  
  IF context_data.profile->>'profession' IS NOT NULL AND LENGTH(TRIM(context_data.profile->>'profession')) > 0 THEN
    score := score + 5;
  END IF;
  
  IF context_data.profile->>'experience_years' IS NOT NULL AND (context_data.profile->>'experience_years')::INTEGER > 0 THEN
    score := score + 3;
  END IF;
  
  IF context_data.profile->>'education_level' IS NOT NULL THEN
    score := score + 4;
  END IF;
  
  IF context_data.profile->>'english_level' IS NOT NULL THEN
    score := score + 3;
  END IF;
  
  IF context_data.profile->>'current_country' IS NOT NULL AND LENGTH(TRIM(context_data.profile->>'current_country')) > 0 THEN
    score := score + 2;
  END IF;
  
  IF context_data.profile->>'email' IS NOT NULL AND LENGTH(TRIM(context_data.profile->>'email')) > 0 THEN
    score := score + 2;
  END IF;
  
  IF context_data.profile->>'marital_status' IS NOT NULL THEN
    score := score + 2;
  END IF;
  
  IF context_data.profile->>'children_count' IS NOT NULL THEN
    score := score + 1;
  END IF;
  
  -- Immigration goals completeness (25 points)
  IF context_data.immigration_goals->>'primary_objective' IS NOT NULL AND LENGTH(TRIM(context_data.immigration_goals->>'primary_objective')) > 0 THEN
    score := score + 8;
  END IF;
  
  IF context_data.immigration_goals->>'category' IS NOT NULL THEN
    score := score + 3;
  END IF;
  
  IF context_data.immigration_goals->>'timeline' IS NOT NULL AND LENGTH(TRIM(context_data.immigration_goals->>'timeline')) > 0 THEN
    score := score + 5;
  END IF;
  
  IF context_data.immigration_goals->>'priority' IS NOT NULL THEN
    score := score + 2;
  END IF;
  
  IF context_data.immigration_goals->>'motivation' IS NOT NULL AND LENGTH(TRIM(context_data.immigration_goals->>'motivation')) > 0 THEN
    score := score + 4;
  END IF;
  
  IF jsonb_array_length(COALESCE(context_data.immigration_goals->'target_states', '[]'::jsonb)) > 0 THEN
    score := score + 2;
  END IF;
  
  IF jsonb_array_length(COALESCE(context_data.immigration_goals->'success_criteria', '[]'::jsonb)) > 0 THEN
    score := score + 1;
  END IF;
  
  -- Current situation completeness (20 points)
  IF context_data.current_situation->>'employment_status' IS NOT NULL THEN
    score := score + 3;
  END IF;
  
  IF context_data.current_situation->>'available_funds' IS NOT NULL AND (context_data.current_situation->>'available_funds')::NUMERIC > 0 THEN
    score := score + 5;
  END IF;
  
  IF jsonb_array_length(COALESCE(context_data.current_situation->'obstacles', '[]'::jsonb)) > 0 THEN
    score := score + 3;
  END IF;
  
  IF jsonb_array_length(COALESCE(context_data.current_situation->'strengths', '[]'::jsonb)) > 0 THEN
    score := score + 3;
  END IF;
  
  IF context_data.current_situation->>'current_salary' IS NOT NULL AND (context_data.current_situation->>'current_salary')::NUMERIC > 0 THEN
    score := score + 2;
  END IF;
  
  IF jsonb_array_length(COALESCE(context_data.current_situation->'us_connections', '[]'::jsonb)) > 0 THEN
    score := score + 2;
  END IF;
  
  IF jsonb_array_length(COALESCE(context_data.current_situation->'previous_visa_attempts', '[]'::jsonb)) > 0 THEN
    score := score + 2;
  END IF;
  
  -- Activities completeness (25 points)
  IF jsonb_array_length(COALESCE(context_data.dream_goals, '[]'::jsonb)) > 0 THEN
    score := score + 10;
  END IF;
  
  IF jsonb_array_length(COALESCE(context_data.visa_analyses, '[]'::jsonb)) > 0 THEN
    score := score + 10;
  END IF;
  
  IF jsonb_array_length(COALESCE(context_data.specialist_interactions, '[]'::jsonb)) > 0 THEN
    score := score + 5;
  END IF;
  
  RETURN LEAST(score, max_score);
END;
$$ LANGUAGE plpgsql;

-- Function to automatically update completeness score on context changes
CREATE OR REPLACE FUNCTION update_context_completeness()
RETURNS TRIGGER AS $$
BEGIN
  NEW.data_completeness_score := calculate_context_completeness(NEW);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update completeness score
CREATE TRIGGER trigger_update_context_completeness
  BEFORE INSERT OR UPDATE ON user_contexts
  FOR EACH ROW
  EXECUTE FUNCTION update_context_completeness();

-- Function to clean up old context history (keep last 100 entries per user)
CREATE OR REPLACE FUNCTION cleanup_old_context_history()
RETURNS void AS $$
BEGIN
  DELETE FROM user_context_history 
  WHERE id IN (
    SELECT id FROM (
      SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY timestamp DESC) as rn
      FROM user_context_history
    ) t WHERE rn > 100
  );
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run cleanup weekly (requires pg_cron extension)
-- Note: This requires the pg_cron extension to be enabled in Supabase
-- SELECT cron.schedule('cleanup-context-history', '0 2 * * 0', 'SELECT cleanup_old_context_history();');

-- Create view for easy context querying with calculated fields
CREATE OR REPLACE VIEW user_contexts_summary AS
SELECT 
  uc.id,
  uc.context_id,
  uc.user_id,
  uc.version,
  uc.created_at,
  uc.updated_at,
  uc.last_accessed,
  uc.data_completeness_score,
  
  -- Extract key profile information
  uc.profile->>'name' as user_name,
  uc.profile->>'profession' as profession,
  (uc.profile->>'age')::INTEGER as age,
  uc.profile->>'current_country' as country,
  
  -- Extract key goals information
  uc.immigration_goals->>'primary_objective' as primary_goal,
  uc.immigration_goals->>'category' as goal_category,
  uc.immigration_goals->>'priority' as priority,
  uc.immigration_goals->>'timeline' as timeline,
  
  -- Extract situation information
  uc.current_situation->>'employment_status' as employment_status,
  (uc.current_situation->>'available_funds')::NUMERIC as available_funds,
  uc.current_situation->>'available_funds_currency' as funds_currency,
  
  -- Count activities
  jsonb_array_length(COALESCE(uc.dream_goals, '[]'::jsonb)) as dreams_count,
  jsonb_array_length(COALESCE(uc.visa_analyses, '[]'::jsonb)) as visa_analyses_count,
  jsonb_array_length(COALESCE(uc.specialist_interactions, '[]'::jsonb)) as specialist_sessions_count,
  
  -- Progress information
  (uc.progress_tracking->>'overall_progress_percentage')::INTEGER as progress_percentage,
  uc.progress_tracking->>'current_phase' as current_phase,
  uc.progress_tracking->>'next_recommended_action' as next_action,
  
  -- AI insights
  (uc.ai_insights->>'confidence_score')::INTEGER as ai_confidence,
  (uc.ai_insights->>'success_probability')::INTEGER as success_probability
  
FROM user_contexts uc;

-- Grant appropriate permissions to the view
GRANT SELECT ON user_contexts_summary TO authenticated;

-- Add RLS policy for the view
ALTER VIEW user_contexts_summary SET (security_invoker = true);

-- Comments for documentation
COMMENT ON TABLE user_contexts IS 'Stores comprehensive user context data for AI specialist integration';
COMMENT ON TABLE user_context_history IS 'Tracks all changes made to user contexts for audit and analysis';
COMMENT ON COLUMN user_contexts.data_completeness_score IS 'Calculated score (0-100) indicating how complete the user profile is';
COMMENT ON COLUMN user_contexts.privacy_settings IS 'JSON object containing user privacy preferences for data sharing';
COMMENT ON VIEW user_contexts_summary IS 'Simplified view of user contexts with extracted key fields for easy querying';
