-- Création des extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS "user" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    last_login TIMESTAMP WITH TIME ZONE,
    location_tracking_enabled BOOLEAN DEFAULT false
);

-- Table des véhicules
CREATE TABLE IF NOT EXISTS "vehicle" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    fuel_type VARCHAR(50),
    consumption DECIMAL(10,2),
    co2_per_km DECIMAL(10,2),
    user_id UUID REFERENCES "user"(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des trajets
CREATE TABLE IF NOT EXISTS "journey" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    start_point JSONB NOT NULL,
    end_point JSONB NOT NULL,
    distance DECIMAL(10,2),
    duration INTEGER,
    co2_emission DECIMAL(10,2),
    transport_type VARCHAR(50),
    user_id UUID REFERENCES "user"(id),
    vehicle_id UUID REFERENCES "vehicle"(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE
);

-- Table des activités
CREATE TABLE IF NOT EXISTS "activity" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL,
    description TEXT,
    user_id UUID REFERENCES "user"(id),
    journey_id UUID REFERENCES "journey"(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- Table des objectifs carbone
CREATE TABLE IF NOT EXISTS "carbon_goal" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES "user"(id),
    target_value DECIMAL(10,2) NOT NULL,
    current_value DECIMAL(10,2) DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des localisations utilisateurs
CREATE TABLE IF NOT EXISTS "user_location" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES "user"(id),
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    accuracy DECIMAL(10,2),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- Table des messages
CREATE TABLE IF NOT EXISTS "message" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES "user"(id),
    content TEXT NOT NULL,
    type VARCHAR(50),
    status VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_journey_user ON journey(user_id);
CREATE INDEX IF NOT EXISTS idx_journey_vehicle ON journey(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_activity_user ON activity(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_journey ON activity(journey_id);
CREATE INDEX IF NOT EXISTS idx_user_location_user ON user_location(user_id);
CREATE INDEX IF NOT EXISTS idx_carbon_goal_user ON carbon_goal(user_id);
CREATE INDEX IF NOT EXISTS idx_message_user ON message(user_id);

-- Triggers pour la mise à jour automatique des timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_updated_at
    BEFORE UPDATE ON "user"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicle_updated_at
    BEFORE UPDATE ON vehicle
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journey_updated_at
    BEFORE UPDATE ON journey
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carbon_goal_updated_at
    BEFORE UPDATE ON carbon_goal
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_message_updated_at
    BEFORE UPDATE ON message
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 