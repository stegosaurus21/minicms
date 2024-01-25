import { useState } from "react";
import { Button, Container, Tab, Table, Tabs } from "react-bootstrap";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import { useNavigate, useParams } from "react-router-dom";
import style from "../styles.module.css";
import { RenderableLeaderboard } from "interface";
import ContestLeaderboard from "components/Contests/ContestLeaderboard";
import { trpc } from "utils/trpc";
import { assertQuerySuccess, round2dp, styleScore } from "utils/helper";
import { error, handleError } from "components/Error";

const ContestPage = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [showUnofficial, setShowUnofficial] = useState<boolean>(false);

  if (!params["contest"]) throw error("ERR_CONTEST_MISSING");

  const queryContestName = params["contest"].replace(":", "/");

  const utils = trpc.useUtils();
  const joinContest = trpc.contest.join.useMutation();

  const leaderboard = trpc.results.getLeaderboard.useQuery({
    contest: queryContestName,
  });
  const user = trpc.auth.validate.useQuery();
  const validation = trpc.contest.validate.useQuery({
    contest: queryContestName,
  });
  const contest = trpc.contest.get.useQuery({ contest: queryContestName });

  const contestName = params["contest"].replace(":", "/");
  try {
    assertQuerySuccess(validation, "ERR_CONTEST_404");
    assertQuerySuccess(contest, "ERR_CONTEST_FETCH");
    assertQuerySuccess(user, "ERR_AUTH");
    assertQuerySuccess(leaderboard, "ERR_LEADERBOARD_FETCH");
  } catch (e) {
    return handleError(e);
  }

  const baseLeaderboard = showUnofficial
    ? leaderboard.data.all
    : leaderboard.data.official;

  const sortedLeaderboard: RenderableLeaderboard[] = Object.keys(
    baseLeaderboard
  ).map((key) => ({
    name: key,
    results: baseLeaderboard[key].results,
    place: undefined,
    total: baseLeaderboard[key].results.reduce((p, n) => p + n.score, 0),
  }));

  sortedLeaderboard.sort((a, b) => a.total - b.total);

  return (
    <>
      <Container>
        <span className={style.returnLink} onClick={() => navigate("./..")}>
          {"<"} Back to contests
        </span>
        <h2>{contest.data.title}</h2>
        <p>{contest.data.description}</p>
        {user.data.isLoggedIn && !validation.data.joined && (
          <>
            <hr />
            <p>Join the contest to participate and view problems.</p>
            <Button
              onClick={async () => {
                await joinContest.mutateAsync({ contest: contestName });
                utils.contest.invalidate();
              }}
            >
              Join contest
            </Button>
            <hr />
          </>
        )}
        {!user.data.isLoggedIn && (
          <>
            <hr />
            <p>Sign in to participate and view problems.</p>
            <Button
              onClick={() =>
                navigate({
                  pathname: "/auth/login",
                  search: `?url=${params["contest"]}`,
                })
              }
            >
              Login / Register
            </Button>
            <hr />
          </>
        )}
        {user.data.isLoggedIn && (
          <Tabs>
            {validation.data.joined && (
              <Tab eventKey="challenges" title="Challenges">
                <Container className="pt-3">
                  <Table bordered className="w-75">
                    <thead>
                      <tr>
                        <th>Challenge</th>
                        <th>Your Submissions</th>
                        <th>Max Score</th>
                        <th>Your Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contest.data.challenges.map(
                        ({ challenge, submissions, max_score }, i) => {
                          const score = Math.max(
                            0,
                            ...submissions.map((x) => x.score || 0)
                          );
                          return (
                            <tr
                              className={style.tableRow}
                              onClick={() =>
                                navigate(
                                  `./${challenge.id.replaceAll("/", ":")}`
                                )
                              }
                            >
                              <td>{challenge.title}</td>
                              <td>{submissions.length}</td>
                              <td>{max_score}</td>
                              <td
                                className={`bg-${
                                  submissions.length > 0
                                    ? styleScore(score, max_score)
                                    : "body"
                                }`}
                              >
                                {round2dp(score)}
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </Table>
                </Container>
              </Tab>
            )}
            <Tab eventKey="leaderboard" title="Leaderboard">
              <Container className="pt-3">
                <FormCheckInput
                  checked={showUnofficial}
                  onChange={(event) => {
                    setShowUnofficial(event.target.checked);
                  }}
                />
                <span> Include unofficial submissions</span>
                <div className="mb-2"></div>
                {user.data.isLoggedIn &&
                  validation.data.joined &&
                  (sortedLeaderboard.findIndex(
                    (x) => x.name === user.data.username
                  ) !== -1 ? (
                    <p>
                      Your {showUnofficial ? "un" : ""}
                      official position is{" "}
                      {`${
                        sortedLeaderboard.findIndex(
                          (x) => x.name === user.data.username
                        ) + 1
                      }${
                        ["st", "nd", "rd", "th"][
                          Math.min(
                            4,
                            sortedLeaderboard.findIndex(
                              (x) => x.name === user.data.username
                            ) % 10
                          )
                        ]
                      }`}{" "}
                      out of {sortedLeaderboard.length} participant
                      {sortedLeaderboard.length > 1 ? "s" : ""}.
                    </p>
                  ) : (
                    <p>
                      You{" "}
                      {contest.data.end_time === null ||
                      new Date() < contest.data.end_time ||
                      showUnofficial
                        ? "are"
                        : "were"}{" "}
                      not a{showUnofficial ? "" : "n official"} participant in
                      this contest.
                    </p>
                  ))}
                <ContestLeaderboard
                  showUnofficial={showUnofficial}
                  username={user.data.username}
                  leaderboard={sortedLeaderboard}
                  challenges={contest.data.challenges.map((x) => ({
                    max_score: x.max_score,
                    title: x.challenge.title,
                  }))}
                />
              </Container>
            </Tab>
          </Tabs>
        )}
      </Container>
    </>
  );
};

export default ContestPage;
