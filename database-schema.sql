-- Make sure uuid extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- WARNING: The section below will DELETE existing tables and data if they exist.
-- Comment these lines out if you want to preserve existing data.
-- DROP TABLE IF EXISTS jobs;
-- DROP TABLE IF EXISTS customers;

-- Create the tables if they don't exist (non-destructive)
CREATE TABLE IF NOT EXISTS customers (
    customer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    company_name TEXT, -- Note: This field is company_name, not company
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT, -- Note: Column is 'state' in the database
    postal_code TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobs (
    job_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(customer_id),
    name TEXT NOT NULL,
    number TEXT,
    status TEXT DEFAULT 'lead',
    description TEXT,
    address TEXT,
    city TEXT,
    province TEXT,
    postal_code TEXT,
    amount DECIMAL(12,2),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sample data insertion - uncomment if you want to add sample data
-- These INSERT statements might fail if the data already exists, 
-- so only run them on a fresh database or modify as needed

/*
INSERT INTO customers (first_name, last_name, company_name, email, phone, address, city, province, postal_code, notes)
VALUES
    ('Otmar', 'Taubner', 'T. Musselman Excavating', 'otmar@musselman.ca', '(416) 555-1234', '685 Lake Rd', 'Toronto', 'ON', 'M4B 1B3', 'Prefers communication via email. Has multiple job sites.'),
    ('Sagarkumar', 'Radadiya', NULL, 'sagarkumar@gmail.com', '(416) 555-5678', NULL, NULL, NULL, NULL, NULL),
    ('Kyle', 'Birnie', 'Bronte Construction', 'kyle@bronteconstruction.com', '(416) 555-9012', '1041 Birchmount Rd', 'Toronto', 'ON', 'M1B 3H2', NULL);

INSERT INTO jobs (customer_id, name, number, status, description, address, city, province, postal_code, amount)
VALUES
    ((SELECT customer_id FROM customers WHERE last_name = 'Taubner' LIMIT 1), 'Soil Hauling', 'M23-030', 'lead', 'Hauling soil from construction site', '685 Lake Rd', 'Toronto', 'ON', 'M4B 1B3', 134944.60),
    ((SELECT customer_id FROM customers WHERE last_name = 'Taubner' LIMIT 1), 'Material Supply', '2024-1805', 'lead', 'Supply of gravel and sand', '685 Lake Rd', 'Toronto', 'ON', 'M4B 1B3', 35044.13),
    ((SELECT customer_id FROM customers WHERE last_name = 'Birnie' LIMIT 1), 'Temporary Asphalt Patching phase 2', '2024-1804', 'lead', 'Temporary patching of damaged asphalt', '1041 Birchmount Rd', 'Toronto', 'ON', 'M1B 3H2', 70550.42);
*/
