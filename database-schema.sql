-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS customers;

-- Create customers table
CREATE TABLE customers (
    customer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    company TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    province TEXT,
    postal_code TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE jobs (
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add some sample data
INSERT INTO customers (first_name, last_name, company, email, phone, address, city, province, postal_code, notes)
VALUES
    ('Otmar', 'Taubner', 'T. Musselman Excavating', 'otmar@musselman.ca', '(416) 555-1234', '685 Lake Rd', 'Toronto', 'ON', 'M4B 1B3', 'Prefers communication via email. Has multiple job sites.'),
    ('Sagarkumar', 'Radadiya', NULL, 'sagarkumar@gmail.com', '(416) 555-5678', NULL, NULL, NULL, NULL, NULL),
    ('Kyle', 'Birnie', 'Bronte Construction', 'kyle@bronteconstruction.com', '(416) 555-9012', '1041 Birchmount Rd', 'Toronto', 'ON', 'M1B 3H2', NULL);

-- Add some sample jobs
INSERT INTO jobs (customer_id, name, number, status, description, address, city, province, postal_code, amount)
VALUES
    ((SELECT customer_id FROM customers WHERE last_name = 'Taubner' LIMIT 1), 'Soil Hauling', 'M23-030', 'lead', 'Hauling soil from construction site', '685 Lake Rd', 'Toronto', 'ON', 'M4B 1B3', 134944.60),
    ((SELECT customer_id FROM customers WHERE last_name = 'Taubner' LIMIT 1), 'Material Supply', '2024-1805', 'lead', 'Supply of gravel and sand', '685 Lake Rd', 'Toronto', 'ON', 'M4B 1B3', 35044.13),
    ((SELECT customer_id FROM customers WHERE last_name = 'Birnie' LIMIT 1), 'Temporary Asphalt Patching phase 2', '2024-1804', 'lead', 'Temporary patching of damaged asphalt', '1041 Birchmount Rd', 'Toronto', 'ON', 'M1B 3H2', 70550.42);
