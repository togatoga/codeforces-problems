DROP TABLE IF EXISTS problem;
CREATE TABLE problem
(
    id SERIAL PRIMARY KEY,
    contest_id INTEGER,
    name  TEXT,
    index  TEXT,
    points INTEGER,
    tags TEXT[],
    solved_count INTEGER,
    unique_key TEXT,
    update_date TIMESTAMP,
    UNIQUE(unique_key),
    UNIQUE(contest_id, index)
);
DROP TABLE IF EXISTS submission;
CREATE TABLE submission
(
    id SERIAL PRIMARY KEY,
    submission_id INTEGER,
    handle TEXT,
    contest_id INTEGER,
    index TEXT,
    programming_language TEXT,
    verdict TEXT,
    unique_key TEXT,
    UNIQUE(unique_key),
    UNIQUE(submission_id)
);

DROP TABLE IF EXISTS contest;
CREATE TABLE contest
(
    id SERIAL PRIMARY KEY,
    contest_id INTEGER,
    name TEXT,
    type TEXT,
    phase TEXT,
    frozen BOOLEAN,
    duration_seconds BIGINT,
    start_unix_time BIGINT,
    UNIQUE(contest_id)
);
