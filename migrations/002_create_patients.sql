CREATE TABLE IF NOT EXISTS patients(
    id UUID PRIMAY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
        phone VARCHAR(20),
        date_of_birth DATE,
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);