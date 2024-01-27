import { Dirent } from "fs";

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

export interface ChallengeScoring {
  weight: number;
  mode: "BATCH" | "INDIVIDUAL";
  constraints?: string[];
  tasks: string[];
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

export interface Challenge {
  id: string;
  name: string;
  type: "SIMPLE_IO";
  time_limit: number;
  memory_limit: number;
  tests: Dirent[];
  scoring: ChallengeScoring[];
}

export interface Token {
  token: string;
}

export interface JudgeResponse {
  time: number;
  memory: number;
  status: string;
  compiler_out: string;
}

export interface Result {
  token: string;
  time: number;
  memory: number;
  status: string;
  compile_output: string;
}

// eslint-disable-next-line no-unused-vars
export type Resolve = (value: boolean) => void;

export interface ResolveCounter {
  counter: number;
  resolve: Resolve;
}

export interface SubmitReturn {
  submissionToken: string;
  resultPromise: Promise<boolean>;
}

export interface Session {
  uId: number;
  timeout: number;
}

export interface ChallengeResult {
  submissions: {
    time: number;
    token: string;
    score: number | null;
    index: number;
    official: boolean;
  }[];
  score: number;
}

export interface LeaderboardEntry {
  results: {
    score: number;
    count: number;
  }[];
}

export interface JudgeLanguage {
  id: number;
  name: string;
  is_archived: boolean;
}

export type AuthValidation =
  | { isLoggedIn: false; username: null }
  | { isLoggedIn: true; username: string };

export type ContestValidation =
  | { joined: false; joinTime: null }
  | { joined: true; joinTime: Date };
