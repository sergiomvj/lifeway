-- Create consolidated analyses table for integrated Dreams + VisaMatch analysis
CREATE TABLE IF NOT EXISTS consolidated_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Source Data (stored as JSONB for flexibility)
  dreams_data JSONB,
  visamatch_data JSONB,
  user_context JSONB NOT NULL,
  
  -- Analysis Results
  dreams_analysis JSONB,
  visa_analysis JSONB,
  
  -- Consolidated Insights
  consolidated_insights JSONB NOT NULL DEFAULT '{}',
  
  -- Integrated Recommendations
  integrated_recommendations JSONB NOT NULL DEFAULT '[]',
  
  -- Overall Scoring
  overall_score JSONB NOT NULL DEFAULT '{}',
  
  -- Status and Review
  analysis_status TEXT NOT NULL DEFAULT 'draft' CHECK (analysis_status IN ('draft', 'partial', 'complete', 'reviewed')),
  specialist_reviewed BOOLEAN DEFAULT FALSE,
  specialist_notes TEXT,
  specialist_id UUID,
  specialist_review_date TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  analysis_version INTEGER DEFAULT 1,
  tags TEXT[] DEFAULT '{}',
  
  -- Foreign key constraints
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  FOREIGN KEY (specialist_id) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create integration workflows table
CREATE TABLE IF NOT EXISTS integration_workflows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  workflow_type TEXT NOT NULL CHECK (workflow_type IN ('dreams_first', 'visa_first', 'parallel', 'specialist_guided')),
  
  -- Current State
  current_step JSONB NOT NULL DEFAULT '{}',
  completed_steps JSONB NOT NULL DEFAULT '[]',
  remaining_steps JSONB NOT NULL DEFAULT '[]',
  
  -- Progress
  overall_progress INTEGER DEFAULT 0 CHECK (overall_progress >= 0 AND overall_progress <= 100),
  estimated_completion TIMESTAMP WITH TIME ZONE,
  
  -- Data Collection Status
  dreams_completed BOOLEAN DEFAULT FALSE,
  visa_analysis_completed BOOLEAN DEFAULT FALSE,
  context_validated BOOLEAN DEFAULT FALSE,
  specialist_consulted BOOLEAN DEFAULT FALSE,
  
  -- Workflow Control
  auto_advance BOOLEAN DEFAULT TRUE,
  user_preferences JSONB NOT NULL DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Foreign key constraints
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create specialist sessions table (enhanced)
CREATE TABLE IF NOT EXISTS specialist_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL,
  specialist_id UUID NOT NULL,
  
  -- Session Type and Status
  session_type TEXT NOT NULL CHECK (session_type IN ('consultation', 'review', 'follow_up', 'emergency')),
  session_status TEXT NOT NULL DEFAULT 'scheduled' CHECK (session_status IN ('scheduled', 'active', 'paused', 'completed', 'cancelled')),
  
  -- Timing
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  scheduled_duration INTEGER DEFAULT 60,
  
  -- Context and Data
  user_context JSONB,
  consolidated_analysis_id UUID,
  
  -- Session Content
  messages JSONB NOT NULL DEFAULT '[]',
  session_notes JSONB NOT NULL DEFAULT '[]',
  session_outcomes JSONB NOT NULL DEFAULT '[]',
  
  -- Follow-up
  follow_up_required BOOLEAN DEFAULT FALSE,
  next_session_recommended TIMESTAMP WITH TIME ZONE,
  
  -- Quality Metrics
  user_satisfaction_rating INTEGER CHECK (user_satisfaction_rating >= 1 AND user_satisfaction_rating <= 5),
  specialist_confidence_rating INTEGER CHECK (specialist_confidence_rating >= 1 AND specialist_confidence_rating <= 5),
  session_quality_metrics JSONB NOT NULL DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Foreign key constraints
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  FOREIGN KEY (specialist_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  FOREIGN KEY (consolidated_analysis_id) REFERENCES consolidated_analyses(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_consolidated_analyses_user_id ON consolidated_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_consolidated_analyses_status ON consolidated_analyses(analysis_status);
CREATE INDEX IF NOT EXISTS idx_consolidated_analyses_created_at ON consolidated_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consolidated_analyses_specialist ON consolidated_analyses(specialist_id, specialist_reviewed);

CREATE INDEX IF NOT EXISTS idx_integration_workflows_user_id ON integration_workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_integration_workflows_type ON integration_workflows(workflow_type);
CREATE INDEX IF NOT EXISTS idx_integration_workflows_progress ON integration_workflows(overall_progress);

CREATE INDEX IF NOT EXISTS idx_specialist_sessions_user_id ON specialist_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_specialist_sessions_specialist_id ON specialist_sessions(specialist_id);
CREATE INDEX IF NOT EXISTS idx_specialist_sessions_status ON specialist_sessions(session_status);
CREATE INDEX IF NOT EXISTS idx_specialist_sessions_start_time ON specialist_sessions(start_time DESC);

-- JSONB indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_consolidated_analyses_insights ON consolidated_analyses USING GIN (consolidated_insights);
CREATE INDEX IF NOT EXISTS idx_consolidated_analyses_recommendations ON consolidated_analyses USING GIN (integrated_recommendations);
CREATE INDEX IF NOT EXISTS idx_consolidated_analyses_score ON consolidated_analyses USING GIN (overall_score);

-- Add RLS (Row Level Security) policies
ALTER TABLE consolidated_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialist_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for consolidated_analyses
CREATE POLICY "Users can read own analyses" ON consolidated_analyses
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses" ON consolidated_analyses
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses" ON consolidated_analyses
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Specialists can read assigned analyses" ON consolidated_analyses
  FOR SELECT TO authenticated USING (auth.uid() = specialist_id OR auth.uid() = user_id);

CREATE POLICY "Specialists can update assigned analyses" ON consolidated_analyses
  FOR UPDATE TO authenticated USING (auth.uid() = specialist_id);

-- Policies for integration_workflows
CREATE POLICY "Users can manage own workflows" ON integration_workflows
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Policies for specialist_sessions
CREATE POLICY "Users can read own sessions" ON specialist_sessions
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR auth.uid() = specialist_id);

CREATE POLICY "Users can insert own sessions" ON specialist_sessions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Specialists can manage assigned sessions" ON specialist_sessions
  FOR ALL TO authenticated USING (auth.uid() = specialist_id);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_consolidated_analysis_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_integration_workflow_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_specialist_session_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER trigger_update_consolidated_analysis_updated_at
  BEFORE UPDATE ON consolidated_analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_consolidated_analysis_updated_at();

CREATE TRIGGER trigger_update_integration_workflow_updated_at
  BEFORE UPDATE ON integration_workflows
  FOR EACH ROW
  EXECUTE FUNCTION update_integration_workflow_updated_at();

CREATE TRIGGER trigger_update_specialist_session_updated_at
  BEFORE UPDATE ON specialist_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_specialist_session_updated_at();

-- Function to calculate analysis completeness
CREATE OR REPLACE FUNCTION calculate_analysis_completeness(analysis_data consolidated_analyses)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
BEGIN
  -- Check for dreams data (20 points)
  IF analysis_data.dreams_data IS NOT NULL THEN
    score := score + 20;
  END IF;
  
  -- Check for visa data (20 points)
  IF analysis_data.visamatch_data IS NOT NULL THEN
    score := score + 20;
  END IF;
  
  -- Check for dreams analysis (15 points)
  IF analysis_data.dreams_analysis IS NOT NULL THEN
    score := score + 15;
  END IF;
  
  -- Check for visa analysis (15 points)
  IF analysis_data.visa_analysis IS NOT NULL THEN
    score := score + 15;
  END IF;
  
  -- Check for consolidated insights (15 points)
  IF jsonb_array_length(COALESCE(analysis_data.consolidated_insights->'profile_strengths', '[]'::jsonb)) > 0 THEN
    score := score + 15;
  END IF;
  
  -- Check for integrated recommendations (10 points)
  IF jsonb_array_length(COALESCE(analysis_data.integrated_recommendations, '[]'::jsonb)) > 0 THEN
    score := score + 10;
  END IF;
  
  -- Check for specialist review (5 points)
  IF analysis_data.specialist_reviewed THEN
    score := score + 5;
  END IF;
  
  RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Function to get user analysis summary
CREATE OR REPLACE FUNCTION get_user_analysis_summary(p_user_id UUID)
RETURNS TABLE (
  total_analyses INTEGER,
  completed_analyses INTEGER,
  specialist_reviewed_analyses INTEGER,
  latest_analysis_date TIMESTAMP WITH TIME ZONE,
  overall_progress INTEGER,
  workflow_status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(ca.id)::INTEGER as total_analyses,
    COUNT(CASE WHEN ca.analysis_status = 'complete' THEN 1 END)::INTEGER as completed_analyses,
    COUNT(CASE WHEN ca.specialist_reviewed THEN 1 END)::INTEGER as specialist_reviewed_analyses,
    MAX(ca.created_at) as latest_analysis_date,
    COALESCE(MAX(iw.overall_progress), 0)::INTEGER as overall_progress,
    COALESCE(MAX(iw.workflow_type), 'not_started') as workflow_status
  FROM consolidated_analyses ca
  LEFT JOIN integration_workflows iw ON iw.user_id = ca.user_id
  WHERE ca.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to cleanup old analysis versions (keep last 5 per user)
CREATE OR REPLACE FUNCTION cleanup_old_analyses()
RETURNS void AS $$
BEGIN
  DELETE FROM consolidated_analyses 
  WHERE id IN (
    SELECT id FROM (
      SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
      FROM consolidated_analyses
    ) t WHERE rn > 5
  );
END;
$$ LANGUAGE plpgsql;

-- Create views for easy querying
CREATE OR REPLACE VIEW user_analysis_overview AS
SELECT 
  ca.id,
  ca.user_id,
  ca.created_at,
  ca.analysis_status,
  ca.specialist_reviewed,
  
  -- Extract key insights
  ca.consolidated_insights->>'dreams_visa_alignment' as alignment_percentage,
  ca.consolidated_insights->>'overall_feasibility' as feasibility_score,
  ca.consolidated_insights->>'timeline_realism' as timeline_assessment,
  
  -- Extract overall scores
  (ca.overall_score->>'overall_readiness')::INTEGER as readiness_score,
  (ca.overall_score->>'success_probability')::INTEGER as success_probability,
  
  -- Count recommendations
  jsonb_array_length(COALESCE(ca.integrated_recommendations, '[]'::jsonb)) as recommendations_count,
  
  -- Analysis completeness
  calculate_analysis_completeness(ca) as completeness_score,
  
  -- Workflow info
  iw.workflow_type,
  iw.overall_progress as workflow_progress,
  iw.dreams_completed,
  iw.visa_analysis_completed,
  iw.specialist_consulted
  
FROM consolidated_analyses ca
LEFT JOIN integration_workflows iw ON iw.user_id = ca.user_id;

-- Grant appropriate permissions
GRANT SELECT ON user_analysis_overview TO authenticated;

-- Add RLS policy for the view
ALTER VIEW user_analysis_overview SET (security_invoker = true);

-- Comments for documentation
COMMENT ON TABLE consolidated_analyses IS 'Stores integrated analysis results from Dreams and VisaMatch tools';
COMMENT ON TABLE integration_workflows IS 'Tracks user progress through the integrated workflow process';
COMMENT ON TABLE specialist_sessions IS 'Enhanced specialist consultation sessions with full context';
COMMENT ON VIEW user_analysis_overview IS 'Simplified view of user analyses with key metrics and progress indicators';

-- Create notification triggers for important events
CREATE OR REPLACE FUNCTION notify_analysis_completed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.analysis_status = 'complete' AND OLD.analysis_status != 'complete' THEN
    -- Here you could add logic to send notifications
    -- For now, we'll just log the event
    INSERT INTO user_context_history (user_id, operation, section, data, timestamp, source, reason)
    VALUES (NEW.user_id, 'update', 'analysis_completed', 
            jsonb_build_object('analysis_id', NEW.id, 'completion_date', NOW()),
            NOW(), 'system', 'Analysis marked as complete');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_analysis_completed
  AFTER UPDATE ON consolidated_analyses
  FOR EACH ROW
  EXECUTE FUNCTION notify_analysis_completed();
