/*
# Create projects table for BOM by Hasina (single-tenant, no auth)

1. New Tables
- `projects`
  - `id` (uuid, primary key)
  - `name` (text, project name, not null)
  - `client` (text)
  - `location` (text)
  - `reference` (text, project reference code)
  - `engineer` (text)
  - `company` (text)
  - `project_date` (date)
  - `config` (jsonb, full project configuration: blocks, PV module, spacing, rails, roof, margin, prices)
  - `bom` (jsonb, cached calculated BOM results)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz, auto-updated)
2. Security
- Enable RLS on `projects`.
- Single-tenant app with no sign-in: allow anon + authenticated full CRUD because all project data is intentionally shared/public in this tool.
3. Notes
- The entire project configuration (blocks, module specs, rail settings, roof config, margin, component prices) is stored as a single jsonb column `config`. This supports autosave and easy duplication.
- The cached BOM result is stored in `bom` jsonb to avoid recalculating on every load.
- `updated_at` auto-updates via a trigger to track last-saved time for the history view.
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Nouveau projet',
  client text DEFAULT '',
  location text DEFAULT '',
  reference text DEFAULT '',
  engineer text DEFAULT '',
  company text DEFAULT '',
  project_date date DEFAULT CURRENT_DATE,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  bom jsonb DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_projects" ON projects;
CREATE POLICY "anon_select_projects" ON projects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_projects" ON projects;
CREATE POLICY "anon_insert_projects" ON projects FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_projects" ON projects;
CREATE POLICY "anon_update_projects" ON projects FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_projects" ON projects;
CREATE POLICY "anon_delete_projects" ON projects FOR DELETE
  TO anon, authenticated USING (true);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Index for sorting by most recently updated
CREATE INDEX IF NOT EXISTS projects_updated_at_idx ON projects (updated_at DESC);
