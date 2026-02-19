-- Create datasets table to store uploaded CSV data
CREATE TABLE IF NOT EXISTS datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create transactions table to store parsed transaction data
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  dataset_id UUID NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
  sender_id VARCHAR(255) NOT NULL,
  receiver_id VARCHAR(255) NOT NULL,
  amount NUMERIC(20,2) NOT NULL,
  timestamp TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dataset_id) REFERENCES datasets(id)
);

-- Create accounts table for quick account lookups
CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY,
  dataset_id UUID NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
  account_id VARCHAR(255) NOT NULL,
  risk_score NUMERIC(5,2) DEFAULT 0,
  total_outgoing NUMERIC(20,2) DEFAULT 0,
  total_incoming NUMERIC(20,2) DEFAULT 0,
  transaction_count INTEGER DEFAULT 0,
  is_whitelisted BOOLEAN DEFAULT FALSE,
  patterns JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(dataset_id, account_id)
);

-- Create fraud analysis results table
CREATE TABLE IF NOT EXISTS fraud_analysis (
  id SERIAL PRIMARY KEY,
  dataset_id UUID UNIQUE REFERENCES datasets(id) ON DELETE CASCADE,
  fraud_rings JSONB,
  suspicious_accounts JSONB,
  analysis_result JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create whitelisted accounts table
CREATE TABLE IF NOT EXISTS whitelisted_accounts (
  id SERIAL PRIMARY KEY,
  dataset_id UUID NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
  account_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(dataset_id, account_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_dataset_id ON transactions(dataset_id);
CREATE INDEX IF NOT EXISTS idx_transactions_sender_id ON transactions(sender_id);
CREATE INDEX IF NOT EXISTS idx_transactions_receiver_id ON transactions(receiver_id);
CREATE INDEX IF NOT EXISTS idx_accounts_dataset_id ON accounts(dataset_id);
CREATE INDEX IF NOT EXISTS idx_accounts_dataset_account_id ON accounts(dataset_id, account_id);
CREATE INDEX IF NOT EXISTS idx_fraud_analysis_dataset_id ON fraud_analysis(dataset_id);
CREATE INDEX IF NOT EXISTS idx_whitelisted_accounts_dataset_id ON whitelisted_accounts(dataset_id);
