export interface Token {
  token: string
};

export interface JudgeResponse {
  time: number,
  memory: number,
  status: string,
  compiler_out: string
};

export interface Result {
  submission: number,
  test_num: number,
  token: string,
  time: number,
  memory: number,
  status: string,
  compile_output: string
};

export type Resolve = (value: unknown) => void;

export interface Session {
  uId: number,
  timeout: number
};