# MiniCMS

A simple contest management system powered by Judge0.

## Easy setup

- Directories as problems
- Config

## Features for competitors

- Leaderboard
- Confetti
- Submission interface
- Sign up

## Features for contest runners

- Safe (powered by Judge0)

## TODO

- (In progress) Admin console
  - Manage users (e.g. grant admin)
  - View submissions
  - Rejudging
- (DONE) Migrate problems to DB
- (DONE) Better token handling
- Better logging
- (DONE(ish)) Make server handle unavailable judge more gracefully
- Fix tests D:
- Bundle with Judge0
- Frontend and backend really should be separate images
- Profile page
- Leaderboard memoization
- Error boundaries
- Replace HTTP errors with TRPC errors
- Refactor other forms with react-hook-form
- Batch judging requests
- Challenge difficulty
- Websockets for live data
- Contest visibility
- Enforce ID restrictions
- Challenge contest weight
- Prevent division by zero in empty task (handle empty tasks gracefully in general)
- Refactor task numbering
- Extra contest configuration options
  - Public leaderboard
  - Submission after close
- Badges
- Show loading screen when queries are refetching
- Contest notifications
- Fix Dockerfile
