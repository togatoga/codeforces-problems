#!/bin/bash
createdb -E utf8 codeforces-problems
# table
psql codeforces-problems -f codeforces-problems.sql