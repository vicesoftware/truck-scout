-- Carriers table (existing)
CREATE TABLE carriers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  mc_number VARCHAR(20),
  dot_number VARCHAR(20),
  phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'Pending',
  rating DECIMAL(3, 1) DEFAULT 0.0
);

-- Insert existing carriers data
INSERT INTO carriers (name, mc_number, dot_number, phone, status, rating) VALUES
('FastTruck Inc.', 'MC123456', 'DOT7890123', '(555) 123-4567', 'Active', 4.8),
('SpeedyHaul Co.', 'MC234567', 'DOT8901234', '(555) 234-5678', 'Pending', 4.5),
('ReliableRoad Ltd.', 'MC345678', 'DOT9012345', '(555) 345-6789', 'Active', 4.9),
('QuickShip Logistics', 'MC456789', 'DOT1234567', '(555) 456-7890', 'Active', 4.7),
('EcoFreight Systems', 'MC567890', 'DOT2345678', '(555) 567-8901', 'Pending', 4.2),
('PrimeHaul Express', 'MC678901', 'DOT3456789', '(555) 678-9012', 'Active', 4.6),
('GreenMile Logistics', 'MC789012', 'DOT4567890', '(555) 789-0123', 'Pending', 4.0),
('SwiftLine Transport', 'MC890123', 'DOT5678901', '(555) 890-1234', 'Active', 4.3),
('MegaMove Carriers', 'MC901234', 'DOT6789012', '(555) 901-2345', 'Active', 4.1),
('TurboTruck Solutions', 'MC012345', 'DOT7890123', '(555) 012-3456', 'Pending', 3.9),
('RapidRoute Shipping', 'MC123456', 'DOT8901234', '(555) 123-4567', 'Active', 4.4),
('CrossCountry Movers', 'MC234567', 'DOT9012345', '(555) 234-5678', 'Active', 4.2),
('PrecisionHaul Inc.', 'MC345678', 'DOT0123456', '(555) 345-6789', 'Pending', 3.8),
('VelocityFreight Lines', 'MC456789', 'DOT1234567', '(555) 456-7890', 'Active', 4.5),
('SureShip Logistics', 'MC567890', 'DOT2345678', '(555) 567-8901', 'Active', 4.7),
('AlphaRoute Carriers', 'MC678901', 'DOT3456789', '(555) 678-9012', 'Pending', 3.6),
('OmegaHaul Express', 'MC789012', 'DOT4567890', '(555) 789-0123', 'Active', 4.9),
('DeltaFreight Systems', 'MC890123', 'DOT5678901', '(555) 890-1234', 'Active', 4.3),
('BetaLine Transport', 'MC901234', 'DOT6789012', '(555) 901-2345', 'Pending', 3.7),
('GammaShip Co.', 'MC012345', 'DOT7890123', '(555) 012-3456', 'Active', 4.1),
('EpsilonMove Logistics', 'MC123456', 'DOT8901234', '(555) 123-4567', 'Active', 4.6),
('ZetaHaul Solutions', 'MC234567', 'DOT9012345', '(555) 234-5678', 'Pending', 3.9),
('EtaFreight Express', 'MC345678', 'DOT0123456', '(555) 345-6789', 'Active', 4.4),
('ThetaShip Inc.', 'MC456789', 'DOT1234567', '(555) 456-7890', 'Active', 4.2),
('IotaRoute Carriers', 'MC567890', 'DOT2345678', '(555) 567-8901', 'Pending', 3.8),
('KappaHaul Co.', 'MC678901', 'DOT3456789', '(555) 678-9012', 'Active', 4.5),
('LambdaFreight Lines', 'MC789012', 'DOT4567890', '(555) 789-0123', 'Active', 4.7),
('MuShip Logistics', 'MC890123', 'DOT5678901', '(555) 890-1234', 'Pending', 3.6),
('NuHaul Express', 'MC901234', 'DOT6789012', '(555) 901-2345', 'Active', 4.9),
('XiRoute Systems', 'MC012345', 'DOT7890123', '(555) 012-3456', 'Active', 4.3),
('OmicronMove Inc.', 'MC123456', 'DOT8901234', '(555) 123-4567', 'Pending', 3.7),
('PiFreight Solutions', 'MC234567', 'DOT9012345', '(555) 234-5678', 'Active', 4.1),
('RhoShip Transport', 'MC345678', 'DOT0123456', '(555) 345-6789', 'Active', 4.6),
('SigmaHaul Co.', 'MC456789', 'DOT1234567', '(555) 456-7890', 'Pending', 3.9),
('TauRoute Express', 'MC567890', 'DOT2345678', '(555) 567-8901', 'Active', 4.4),
('UpsilonFreight Lines', 'MC678901', 'DOT3456789', '(555) 678-9012', 'Active', 4.2),
('PhiShip Logistics', 'MC789012', 'DOT4567890', '(555) 789-0123', 'Pending', 3.8),
('ChiHaul Solutions', 'MC890123', 'DOT5678901', '(555) 890-1234', 'Active', 4.5),
('PsiMove Express', 'MC901234', 'DOT6789012', '(555) 901-2345', 'Active', 4.7),
('OmegaRoute Systems', 'MC012345', 'DOT7890123', '(555) 012-3456', 'Pending', 3.6),
('AlphaShip Co.', 'MC123456', 'DOT8901234', '(555) 123-4567', 'Active', 4.9),
('BetaFreight Inc.', 'MC234567', 'DOT9012345', '(555) 234-5678', 'Active', 4.3),
('GammaHaul Express', 'MC345678', 'DOT0123456', '(555) 345-6789', 'Pending', 3.7),
('DeltaRoute Logistics', 'MC456789', 'DOT1234567', '(555) 456-7890', 'Active', 4.1),
('EpsilonShip Transport', 'MC567890', 'DOT2345678', '(555) 567-8901', 'Active', 4.6),
('ZetaFreight Lines', 'MC678901', 'DOT3456789', '(555) 678-9012', 'Pending', 3.9),
('EtaHaul Solutions', 'MC789012', 'DOT4567890', '(555) 789-0123', 'Active', 4.4),
('ThetaRoute Express', 'MC890123', 'DOT5678901', '(555) 890-1234', 'Active', 4.2),
('IotaShip Co.', 'MC901234', 'DOT6789012', '(555) 901-2345', 'Pending', 3.8),
('KappaFreight Systems', 'MC012345', 'DOT7890123', '(555) 012-3456', 'Active', 4.5);

-- Brokers table
CREATE TYPE broker_type AS ENUM ('BROKER_ONLY', 'BROKER_CARRIER');

CREATE TABLE brokers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    type broker_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sample brokers data
INSERT INTO brokers (name, contact_email, contact_phone, type) VALUES
('Global Logistics Solutions', 'contact@gls.com', '(555) 111-2222', 'BROKER_ONLY'),
('TransConnect Brokers', 'info@transconnect.com', '(555) 333-4444', 'BROKER_CARRIER'),
('Swift Freight Brokers', 'support@swiftfreight.com', '(555) 555-6666', 'BROKER_ONLY');

-- Loads table
CREATE TYPE load_status AS ENUM (
    'CREATED', 
    'SEARCHING', 
    'NEGOTIATING', 
    'ASSIGNED', 
    'IN_PROGRESS', 
    'COMPLETED', 
    'INVOICED', 
    'PAID', 
    'CANCELLED'
);

CREATE TABLE loads (
    id SERIAL PRIMARY KEY,
    broker_id INTEGER NOT NULL REFERENCES brokers(id),
    carrier_id INTEGER REFERENCES carriers(id), -- Optional reference to carriers table
    shipper_id INTEGER, -- TODO: Create shippers table and add reference
    status load_status NOT NULL DEFAULT 'CREATED',
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    weight NUMERIC(10, 2),
    dimensions VARCHAR(100),
    special_instructions TEXT,
    rate NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sample loads data
INSERT INTO loads (
    broker_id, 
    carrier_id, 
    shipper_id, 
    status, 
    origin, 
    destination, 
    weight, 
    dimensions, 
    special_instructions, 
    rate
) VALUES (
    1, 
    NULL, 
    NULL, 
    'CREATED', 
    'Los Angeles, CA', 
    'New York, NY', 
    25000.50, 
    '48x48x96', 
    'Fragile electronics, handle with care', 
    5500.00
);

-- Optional: Add indexes for performance
CREATE INDEX idx_brokers_name ON brokers(name);
CREATE INDEX idx_loads_broker_id ON loads(broker_id);
CREATE INDEX idx_loads_status ON loads(status);
