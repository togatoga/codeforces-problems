DROP TABLE IF EXISTS problem;
CREATE TABLE problem
(
    id SERIAL PRIMARY KEY,
    contest_id INTEGER,
    name  TEXT,
    index  TEXT,
    points INTEGER,
    tags TEXT[],
    UNIQUE(contest_id, index)
);
-- submission
-- user
