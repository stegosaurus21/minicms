export interface ContestMeta {
  id: string;
  name: string;
  text: string;
  starts: number | null;
  ends: number | null;
}

export interface ContestChallenge {
  id: string;
  max_score: number;
}

interface ContestChallenges {
  challenges: ContestChallenge[];
}

export type Contest = ContestMeta & ContestChallenges;

interface ContestChallengeDetails {
  name: string;
  score: number;
  submissions: number;
}

export type ContestChallengeExternal = ContestChallenge &
  ContestChallengeDetails;

interface ContestChallengesExternal {
  challenges: ContestChallengeExternal[];
}

export type ContestExternal = ContestMeta & ContestChallengesExternal;

export interface LeaderboardEntry {
  results: {
    score: number;
    count: number;
  }[];
}

export interface Leaderboard {
  all: Record<string, LeaderboardEntry>;
  official: Record<string, LeaderboardEntry>;
}

export interface RenderableLeaderboard {
  name: string;
  results: {
    score: number;
    count: number;
  }[];
  total: number;
}

export interface Submission {
  time: number;
  token: string;
  score: number;
  index: number;
  official: boolean;
}

export interface ChallengeResult {
  submissions: Submission[];
  score: number;
}

export interface ChallengeDescription {
  header: string;
  body: string;
}

export interface ChallengeExternal {
  name: string;
  description: ChallengeDescription;
  max_score: number;
  tasks: number;
  scoring: {
    weight: number;
    mode: "BATCH" | "INDIVIDUAL";
    tasks: number[];
  }[];
}

export type EmptyObject = Record<string, never>;

export interface Language {
  id: number;
  name: string;
}

export interface Result {
  token: string;
  time: number;
  memory: number;
  status: string;
  compile_output: string;
}
