-- Add 'pending_verification' status to the recording_status enum
-- NOTE: In PostgreSQL, adding a value to an ENUM is a multi-step process.
-- For this context, we will represent the final state. A real migration would use ALTER TYPE.
-- CREATE TYPE public.recording_status AS ENUM ('in_progress', 'completed', 'abandoned', 'scheduled_release', 'released', 'pending_verification');
-- A safe way to add a value if the type already exists:
ALTER TYPE public.recording_status ADD VALUE IF NOT EXISTS 'pending_verification';


-- Create a new table to track the multi-stage verification process
CREATE TABLE public.verification_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    project_id uuid NOT NULL REFERENCES public.legacy_projects(id) ON DELETE CASCADE,
    requestor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL, -- Who initiated the request
    status TEXT NOT NULL DEFAULT 'pending_review', -- 'pending_review', 'additional_info_required', 'approved', 'rejected'
    
    -- Evidence storage
    death_certificate_url TEXT,
    obituary_url TEXT,
    notarized_affidavit_url TEXT,
    
    -- Admin review fields
    admin_reviewer_id uuid REFERENCES public.profiles(id), -- The admin who reviewed it
    notes TEXT, -- Admin notes
    confidence_score SMALLINT, -- A score from 0-100 on the confidence of the verification
    
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Index for querying requests by project or status
CREATE INDEX idx_verification_requests_project_id ON public.verification_requests(project_id);
CREATE INDEX idx_verification_requests_status ON public.verification_requests(status);

-- RLS for verification_requests
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Project owner can see the status of their own project's verification.
CREATE POLICY "Recorders can view their own project verification requests"
ON public.verification_requests
FOR SELECT
USING (project_id IN (SELECT id FROM public.legacy_projects WHERE recorder_id = auth.uid()));

-- Policy: Admins can manage all verification requests.
-- This assumes a custom claim 'user_role' is set on your users for admin privileges.
CREATE POLICY "Admins can manage all verification requests"
ON public.verification_requests
FOR ALL
USING (get_my_claim('user_role')::text = 'admin');

-- Add trigger for updated_at timestamp
CREATE TRIGGER handle_updated_at
BEFORE UPDATE ON public.verification_requests
FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
