import { config } from "./config";
import {
  ChallengeExternal,
  ChallengeResult,
  EmptyObject,
  Language,
  Leaderboard,
  Result,
} from "./interface";

export class Api {
  static token: string = localStorage.getItem("token") || "";

  public static refreshToken() {
    Api.token = localStorage.getItem("token") || "";
  }

  public static async login(username: string, password: string): Promise<null> {
    const result = await this.makeBackendRequest("POST", "/auth/login", null, {
      username: username,
      password: password,
    });
    this.token = result.token;
    localStorage.setItem("token", this.token);
    return null;
  }

  public static async register(
    username: string,
    password: string
  ): Promise<EmptyObject> {
    return this.makeBackendRequest("POST", "/auth/register", null, {
      username: username,
      password: password,
    });
  }

  public static async logout(): Promise<null> {
    await this.makeBackendRequest("POST", "/auth/logout", this.token);
    this.token = "";
    return null;
  }

  public static async validate(): Promise<{ username: string }> {
    if (this.token === "") throw new Error("validate: not logged in");
    return this.makeBackendRequest("GET", "/auth/validate", this.token);
  }

  /* public static async getContestList(): Promise<{ contests: ContestMeta[] }> {
    return this.makeBackendRequest("GET", "/contest/list", this.token);
  } */

  /* public static async getContest(
    contest: string | undefined
  ): Promise<ContestExternal> {
    if (contest === undefined) throw new Error("getContest: no contest given");
    return this.makeBackendRequest("GET", "/contest", this.token, {
      contest: contest,
    });
  } */

  /* public static async contestValidate(
    contest: string | undefined
  ): Promise<{ time: number }> {
    if (contest === undefined)
      throw new Error("contestValidate: no contest given");
    return this.makeBackendRequest("GET", "/contest/validate", this.token, {
      contest: contest,
    });
  } */

  public static async getLeaderboard(
    contest: string | undefined,
    official: boolean
  ): Promise<{ leaderboard: Leaderboard }> {
    if (contest === undefined)
      throw new Error("getLeaderboard: no contest given");
    return this.makeBackendRequest("GET", "/results/leaderboard", this.token, {
      contest: contest,
      official: official,
    });
  }

  /* public static async joinContest(
    contest: string | undefined
  ): Promise<EmptyObject> {
    if (contest === undefined) throw new Error("joinContest: no contest given");
    return this.makeBackendRequest("POST", "/contest/join", this.token, {
      contest: contest,
    });
  } */

  public static async challengeValidate(
    contest: string | undefined,
    challenge: string | undefined
  ): Promise<EmptyObject> {
    if (contest === undefined)
      throw new Error("challengeValidate: no contest given");
    if (challenge === undefined)
      throw new Error("challengeValidate: no challenge given");
    return this.makeBackendRequest("GET", "/challenge/validate", this.token, {
      contest: contest,
      challenge: challenge,
    });
  }

  public static async getChallenge(
    contest: string | undefined,
    challenge: string | undefined
  ): Promise<ChallengeExternal> {
    if (contest === undefined)
      throw new Error("getChallenge: no contest given");
    if (challenge === undefined)
      throw new Error("getChallenge: no challenge given");
    return this.makeBackendRequest("GET", "/challenge", this.token, {
      contest: contest,
      challenge: challenge,
    });
  }

  public static async resultsValidate(
    contest: string | undefined,
    challenge: string | undefined,
    submission: string | undefined
  ): Promise<EmptyObject> {
    if (contest === undefined)
      throw new Error("resultsValidate: no contest given");
    if (challenge === undefined)
      throw new Error("resultsValidate: no challenge given");
    if (submission === undefined)
      throw new Error("resultsValidate: no submission given");
    return this.makeBackendRequest("GET", "/results/validate", this.token, {
      contest: contest,
      challenge: challenge,
      submission: submission,
    });
  }

  public static async getChallengeResults(
    contest: string | undefined,
    challenge: string | undefined
  ): Promise<ChallengeResult> {
    if (contest === undefined)
      throw new Error("getChallengeResults: no contest given");
    if (challenge === undefined)
      throw new Error("getChallengeResults: no challenge given");
    return this.makeBackendRequest("GET", "/results/challenge", this.token, {
      contest: contest,
      challenge: challenge,
    });
  }

  public static async getTestResults(
    submission: string | undefined,
    test_index: number
  ): Promise<Result> {
    if (submission === undefined)
      throw new Error("getTestResults: no submission given");
    return this.makeBackendRequest(
      "GET",
      `/results/tests/${test_index}`,
      this.token,
      {
        submission: submission,
      }
    );
  }

  public static async getSubmissionSource(
    submission: string | undefined
  ): Promise<{ src: string }> {
    if (submission === undefined)
      throw new Error("getSubmissionSource: no submission given");
    return this.makeBackendRequest("GET", `/results/source`, this.token, {
      submission: submission,
    });
  }

  public static async pollSubmissionResult(
    submission: string | undefined
  ): Promise<{ score: number }> {
    if (submission === undefined)
      throw new Error("getSubmissionSource: no submission given");
    return this.makeBackendRequest("GET", `/results`, this.token, {
      submission: submission,
    });
  }

  public static async getLanguages(): Promise<Language[]> {
    return this.makeBackendRequest("GET", "/languages", this.token);
  }

  public static async submit(
    contest: string,
    challenge: string,
    language_id: string,
    file: File
  ): Promise<{ token: string }> {
    let result;
    if (contest) contest = contest.replaceAll(":", "/");
    if (challenge) challenge = challenge.replaceAll(":", "/");
    const data = new FormData();
    data.append("src", file);
    data.append("language_id", language_id);
    data.append("contest", contest);
    data.append("challenge", challenge);
    result = await fetch(
      `http://${config.BACKEND_URL}:${config.BACKEND_PORT}/submit`,
      {
        method: "POST",
        headers: {
          "token": this.token || "",
        },
        body: data,
      }
    );

    const obj = await result.json();
    if (!result.ok) {
      const message = `Submission error: ${result.status}: ${obj.error}`;
      throw new Error(message);
    } else {
      return obj;
    }
  }

  static async makeBackendRequest(
    method: "GET" | "POST" | "DELETE",
    route: string,
    token: string | null,
    args: any = undefined
  ) {
    let result;
    if (args && args.contest) args.contest = args.contest.replaceAll(":", "/");
    if (args && args.challenge)
      args.challenge = args.challenge.replaceAll(":", "/");
    if (method === "GET" || method === "DELETE") {
      result = await fetch(
        `http://${config.BACKEND_URL}:${config.BACKEND_PORT}${route}${
          args ? `?${new URLSearchParams(args)}` : ""
        }`,
        {
          method: method,
          headers: {
            "Content-Type": "application/json",
            "token": token || "",
          },
        }
      );
    } else {
      result = await fetch(
        `http://${config.BACKEND_URL}:${config.BACKEND_PORT}${route}`,
        {
          method: method,
          headers: {
            "Content-Type": "application/json",
            "token": token || "",
          },
          body: JSON.stringify(args),
        }
      );
    }

    const obj = await result.json();
    if (!result.ok) {
      const message = `An error has occured: ${result.status}: ${obj.error}`;
      throw new Error(message);
    } else {
      return obj;
    }
  }
}
