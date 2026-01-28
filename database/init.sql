-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & RBAC
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT REFERENCES roles(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CRM MODULE
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20),
    email VARCHAR(100),
    status VARCHAR(20) DEFAULT 'NEW', -- NEW, CONTACTED, QUALIFIED, LOST, CONVERTED
    assigned_to UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id),
    total_amount DECIMAL(15, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'DRAFT', -- DRAFT, SENT, APPROVED, REJECTED
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sales_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quotation_id UUID REFERENCES quotations(id),
    customer_po_ref VARCHAR(50),
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, CONFIRMED, SHIPPED, COMPLETED
    delivery_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. INVENTORY & PRODUCTS
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    unit_price DECIMAL(10, 2) NOT NULL,
    cost_price DECIMAL(10, 2),
    stock_quantity INT DEFAULT 0,
    reorder_level INT DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE warehouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    location VARCHAR(100)
);

CREATE TABLE stock_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id),
    warehouse_id INT REFERENCES warehouses(id),
    transaction_type VARCHAR(20) NOT NULL, -- IN, OUT
    quantity INT NOT NULL,
    reference_doc_id UUID, -- Links to PO or SO or WO
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. PURCHASE MODULE
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT
);

CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES vendors(id),
    status VARCHAR(20) DEFAULT 'DRAFT', -- DRAFT, SENT, RECEIVED, CLOSED
    total_amount DECIMAL(15, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE po_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_id UUID REFERENCES purchase_orders(id),
    product_id UUID REFERENCES products(id),
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL
);

-- 5. PRODUCTION MODULE
CREATE TABLE work_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sales_order_id UUID REFERENCES sales_orders(id),
    product_id UUID REFERENCES products(id),
    quantity INT NOT NULL,
    status VARCHAR(20) DEFAULT 'PLANNED', -- PLANNED, IN_PROGRESS, QC, COMPLETED
    start_date DATE,
    end_date DATE
);

CREATE TABLE bill_of_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id), -- Finished Good
    component_id UUID REFERENCES products(id), -- Raw Material
    quantity_required DECIMAL(10, 4) NOT NULL
);

-- 6. FINANCE MODULE
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL -- ASSET, LIABILITY, EQUITY, INCOME, EXPENSE
);

CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    description TEXT,
    reference_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE journal_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journal_entry_id UUID REFERENCES journal_entries(id),
    account_id INT REFERENCES accounts(id),
    debit DECIMAL(15, 2) DEFAULT 0,
    credit DECIMAL(15, 2) DEFAULT 0
);

-- 7. HR MODULE
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    department VARCHAR(50),
    designation VARCHAR(50),
    date_of_joining DATE,
    salary DECIMAL(10, 2)
);

CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id),
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    status VARCHAR(10) -- PRESENT, ABSENT, LEAVE
);

-- INITIAL SEED DATA
INSERT INTO roles (name, description) VALUES 
('ADMIN', 'System Administrator with full access'),
('MANAGER', 'Department Manager with approval access'),
('USER', 'Standard User with restricted access');

INSERT INTO accounts (code, name, type) VALUES
('1000', 'Cash', 'ASSET'),
('1100', 'Accounts Receivable', 'ASSET'),
('2000', 'Accounts Payable', 'LIABILITY'),
('4000', 'Sales Revenue', 'INCOME'),
('5000', 'Cost of Goods Sold', 'EXPENSE');

-- Seed Users (Passwords are 'password123' hashed with bcrypt for demo purposes)
-- Note: In production, use real hashing. This hash is a placeholder example.
INSERT INTO users (full_name, email, password_hash, role_id, is_active) VALUES 
('Admin User', 'admin@erp.com', '$2b$10$wT.f..k/x/y/z/password_hash_placeholder', (SELECT id FROM roles WHERE name='ADMIN'), TRUE),
('Manager User', 'manager@erp.com', '$2b$10$wT.f..k/x/y/z/password_hash_placeholder', (SELECT id FROM roles WHERE name='MANAGER'), TRUE),
('Staff User', 'staff@erp.com', '$2b$10$wT.f..k/x/y/z/password_hash_placeholder', (SELECT id FROM roles WHERE name='USER'), TRUE);

