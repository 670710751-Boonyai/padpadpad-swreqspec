CREATE TABLE IF NOT EXISTS camp_projects (
    project_id TEXT PRIMARY KEY,
    project_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived'))
);

CREATE TABLE IF NOT EXISTS camp_locations (
    location_id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES camp_projects (project_id),
    location_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sub_activities (
    activity_id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES camp_projects (project_id),
    location_id TEXT NOT NULL REFERENCES camp_locations (location_id),
    activity_name TEXT NOT NULL,
    activity_date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    description TEXT NOT NULL,
    facilitator_or_responsible TEXT NOT NULL,
    checklist_status TEXT NOT NULL DEFAULT 'Pending' CHECK (checklist_status IN ('Pending', 'Done')),
    created_by TEXT,
    updated_by TEXT
);

CREATE TABLE IF NOT EXISTS user_permissions (
    user_id TEXT PRIMARY KEY,
    role TEXT NOT NULL CHECK (role IN ('committee', 'faculty', 'staff')),
    can_view_schedule BOOLEAN NOT NULL DEFAULT FALSE,
    can_manage_schedule BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS camps (
    camp_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    open_date TEXT,
    close_date TEXT,
    required_fields_json TEXT NOT NULL DEFAULT '[]',
    required_documents_json TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
    application_id TEXT PRIMARY KEY,
    applicant_id TEXT NOT NULL,
    camp_id TEXT NOT NULL REFERENCES camps (camp_id),
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewed', 'rejected')),
    form_data_json TEXT NOT NULL DEFAULT '{}',
    submitted_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (applicant_id, camp_id)
);

ALTER TABLE applications
    ADD COLUMN IF NOT EXISTS form_data_json TEXT NOT NULL DEFAULT '{}';

CREATE TABLE IF NOT EXISTS application_drafts (
    draft_id TEXT PRIMARY KEY,
    applicant_id TEXT NOT NULL,
    camp_id TEXT NOT NULL REFERENCES camps (camp_id),
    form_data_json TEXT NOT NULL DEFAULT '{}',
    last_saved_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (applicant_id, camp_id)
);

CREATE TABLE IF NOT EXISTS application_documents (
    document_id TEXT PRIMARY KEY,
    draft_id TEXT REFERENCES application_drafts (draft_id),
    application_id TEXT REFERENCES applications (application_id),
    document_type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_content BYTEA,
    validation_status TEXT NOT NULL DEFAULT 'pending' CHECK (validation_status IN ('pending', 'valid', 'invalid')),
    validated_at TEXT
);
