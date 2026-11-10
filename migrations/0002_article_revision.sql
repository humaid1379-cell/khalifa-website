-- Apply once to existing databases before deploying revision-aware handlers.
-- New databases initialized with schema.sql already contain this column.
-- Existing article text and timestamps are preserved; all start at revision 1.
ALTER TABLE articles ADD COLUMN revision INTEGER NOT NULL DEFAULT 1 CHECK (revision >= 1);
