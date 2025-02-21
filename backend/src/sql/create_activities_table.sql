-- Create enum types first
CREATE TYPE activities_type_enum AS ENUM ('vehicle', 'journey', 'user');
CREATE TYPE activities_action_enum AS ENUM ('create', 'update', 'delete');

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type activities_type_enum NOT NULL,
    action activities_action_enum NOT NULL,
    details JSONB NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);

-- Add table comment
COMMENT ON TABLE activities IS 'Stores user activities and system events';

-- Add column comments
COMMENT ON COLUMN activities.id IS 'Unique identifier for the activity';
COMMENT ON COLUMN activities.type IS 'Type of entity the activity relates to';
COMMENT ON COLUMN activities.action IS 'Type of action performed';
COMMENT ON COLUMN activities.details IS 'JSON object containing activity-specific details';
COMMENT ON COLUMN activities.timestamp IS 'When the activity occurred';
COMMENT ON COLUMN activities.user_id IS 'User who performed the activity';
