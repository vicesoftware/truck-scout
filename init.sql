CREATE TABLE carriers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  mc_number VARCHAR(20),
  dot_number VARCHAR(20),
  phone VARCHAR(20)
);

INSERT INTO carriers (name, mc_number, dot_number, phone) VALUES
('ABC Trucking', 'MC123456', 'DOT7890123', '(555) 123-4567'),
('XYZ Logistics', 'MC234567', 'DOT8901234', '(555) 234-5678'),
('Fast Freight Inc.', 'MC345678', 'DOT9012345', '(555) 345-6789');