-- ============================================================================
-- Schema Updates - API Alignment (002)
-- ============================================================================
-- Changes approved:
-- - questions: add question_uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid()
-- - legacy_projects: add recipient_name TEXT NOT NULL, recipient_email TEXT, recipient_photo_url TEXT
-- - recording_sessions: add session_number INT NOT NULL, emotional_peak emotional_state,
--   total_duration_seconds INT NOT NULL DEFAULT 0, total_answers INT NOT NULL DEFAULT 0,
--   UNIQUE(project_id, session_number)
-- - answers: add is_final BOOLEAN NOT NULL DEFAULT true, attempt_number INT NOT NULL DEFAULT 1
-- ============================================================================

-- questions
alter table public.questions
  add column question_uuid uuid not null default gen_random_uuid();
alter table public.questions
  add constraint questions_question_uuid_key unique (question_uuid);
-- legacy_projects: add recipient fields
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'legacy_projects' and column_name = 'recipient_name'
  ) then
    alter table public.legacy_projects add column recipient_name text;
    update public.legacy_projects set recipient_name = '' where recipient_name is null;
    alter table public.legacy_projects alter column recipient_name set not null;
  end if;
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'legacy_projects' and column_name = 'recipient_email'
  ) then
    alter table public.legacy_projects add column recipient_email text;
  end if;
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'legacy_projects' and column_name = 'recipient_photo_url'
  ) then
    alter table public.legacy_projects add column recipient_photo_url text;
  end if;
end $$;
-- recording_sessions: add new fields and unique constraint
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'recording_sessions' and column_name = 'session_number'
  ) then
    alter table public.recording_sessions add column session_number integer;
    update public.recording_sessions set session_number = 1 where session_number is null;
    alter table public.recording_sessions alter column session_number set not null;
  end if;
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'recording_sessions' and column_name = 'emotional_peak'
  ) then
    alter table public.recording_sessions add column emotional_peak public.emotional_state;
  end if;
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'recording_sessions' and column_name = 'total_duration_seconds'
  ) then
    alter table public.recording_sessions add column total_duration_seconds integer not null default 0;
  end if;
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'recording_sessions' and column_name = 'total_answers'
  ) then
    alter table public.recording_sessions add column total_answers integer not null default 0;
  end if;
end $$;
-- Unique constraint (project_id, session_number)
alter table public.recording_sessions
  add constraint uniq_recording_sessions_project_session unique (project_id, session_number);
-- answers: add lifecycle fields
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'answers' and column_name = 'is_final'
  ) then
    alter table public.answers add column is_final boolean not null default true;
  end if;
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'answers' and column_name = 'attempt_number'
  ) then
    alter table public.answers add column attempt_number integer not null default 1;
  end if;
end $$;
-- Indexes to support new fields
create index if not exists idx_questions_question_uuid on public.questions (question_uuid);
create index if not exists idx_sessions_project_session_number on public.recording_sessions (project_id, session_number);
-- End of 002 schema updates;
