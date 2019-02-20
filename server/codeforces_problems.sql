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
    problem_key TEXT,
    update_date TIMESTAMP,
    UNIQUE(problem_key),
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
    create_unix_time BIGINT,
    programming_language TEXT,
    verdict TEXT,
    problem_key TEXT,
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

DROP TABLE IF EXISTS api_hist_submissions;
CREATE TABLE api_hist_submissions
(
    id SERIAL PRIMARY KEY,
    user TEXT,
    update_date TIMESTAMP
    UNIQUE(user)
);