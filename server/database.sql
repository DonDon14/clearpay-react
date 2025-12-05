

CREATE TABLE announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'general',
    priority VARCHAR(20) DEFAULT 'low',
    target_audience VARCHAR(50) DEFAULT 'all', 
    status VARCHAR(20) DEFAULT 'draft', -- <--- FIXED: Changed 'active' to 'draft'
    created_by INT NULL,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Better to use CURRENT_TIMESTAMP than NULL
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints (Notice the commas above!)
    CONSTRAINT announcements_type_check CHECK (type IN ('general', 'urgent', 'maintenance', 'event', 'deadline')),
    CONSTRAINT announcements_priority_check CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    CONSTRAINT announcements_target_audience_check CHECK (target_audience IN ('admins', 'officers', 'members', 'both', 'all', 'staff')),
    CONSTRAINT announcements_status_check CHECK (status IN ('draft', 'published', 'archived')),
    
    -- Foreign Key
    CONSTRAINT announcements_created_by_fkey FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
);