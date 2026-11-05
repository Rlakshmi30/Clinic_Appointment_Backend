CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    patients_id UUID NOT NULL
        REFERENCES patients(id) ON DELETE CASCADE,
        
    doctor_id UUID NOT NULL
    REFERENCES doctors(id) ON DELETE CASCADE,

    appointments_date DATE NOT NULL,
    appointments_time TIME NOT NULL,

    reason TEXT,

    status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (
        status IN (
            'pending',
            'confirmed',
            'completed',
            'cancelled'
        )
    ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_appointments_patient
ON appointments(patients_id);
 CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date
 ON appointments(doctor_id, appointments_date)
