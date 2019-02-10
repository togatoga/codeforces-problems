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
    update_date TIMESTAMP,
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
    UNIQUE(submission_id)
);
