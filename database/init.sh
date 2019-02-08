#!/bin/bash
dropdb codeforces_problems -U postgres -W
createdb -E utf8 codeforces_problems -U postgres -W
# table
psql -U postgres -W -d codeforces_problems -f codeforces_problems.sql
