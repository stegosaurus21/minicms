import { format } from "date-fns";
import React, { useEffect, useState, useContext } from "react";
import { Button, Container, Tab, Table, Tabs } from "react-bootstrap";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import { useNavigate, useParams } from "react-router-dom";
import { TokenProp } from "src/App";
import { round2dp, styleScore } from "src/utils/helper";
import { config } from "../config";
import style from "../styles.module.css";
import {
  ContestExternal,
  Leaderboard,
  LeaderboardEntry,
  RenderableLeaderboard,
} from "src/interface";
import ContestLeaderboard from "src/components/Contests/ContestLeaderboard";
import { Api } from "src/Api";
import ErrorPage from "src/components/Error";
import { trpc } from "src/utils/trpc";

const ContestPage = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
  const [showUnofficial, setShowUnofficial] = useState<boolean>(false);
  const [complete, setComplete] = useState<boolean>(false);

  let sortedLeaderboard: RenderableLeaderboard[] | undefined = undefined;
  if (leaderboard) {
    console.log(leaderboard);
    let baseLeaderboard = showUnofficial
      ? leaderboard.all
      : leaderboard.official;

    sortedLeaderboard = Object.keys(baseLeaderboard).map((key) => ({
      name: key,
      results: baseLeaderboard[key].results,
      place: undefined,
      total: baseLeaderboard[key].results.reduce((p, n) => p + n.score, 0),
    }));

    sortedLeaderboard.sort((a, b) => a.total - b.total);
  }

  const queryContestName = (params["contest"] || "").replace(":", "/");

  const utils = trpc.useContext();
  const joinContest = trpc.contest.join.useMutation();

  const user = trpc.auth.validate.useQuery();
  const validation = trpc.contest.validate.useQuery(
    { contest: queryContestName },
    { enabled: queryContestName !== "" }
  );
  const contest = trpc.contest.get.useQuery(
    { contest: queryContestName },
    { enabled: queryContestName !== "" }
  );

  useEffect(() => {
    if (user.status !== "success") return;
    Api.getLeaderboard(params["contest"], !showUnofficial).then((res) => {
      setLeaderboard(res.leaderboard);
      setComplete(true);
    });
  }, [user.status]);

  if (!params["contest"])
    return <ErrorPage message="No contest given."></ErrorPage>;
  const contestName = params["contest"].replace(":", "/");

  if (validation.isLoading) return <></>;
  if (validation.isError)
    return <ErrorPage message="A contest authentication error occurred." />;

  if (contest.isLoading) return <></>;
  if (contest.isError)
    return <ErrorPage message="Contest not found."></ErrorPage>;

  if (user.isLoading) return <></>;
  if (user.isError)
    return <ErrorPage message="A server authentication error occurred." />;

  if (!params["contest"])
    return <ErrorPage message="No contest given."></ErrorPage>;
  return (
    <>
      <Container>
        <span className={style.returnLink} onClick={() => navigate("./..")}>
          {"<"} Back to contests
        </span>
        <h2>{contest.data.name}</h2>
        <p>{contest.data.text}</p>
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
                      {contest.data.challenges.map((challenge, i) => (
                        <tr
                          className={style.tableRow}
                          onClick={() =>
                            navigate(`./${challenge.id.replaceAll("/", ":")}`)
                          }
                        >
                          <td>{challenge.name}</td>
                          <td>{challenge.submissions}</td>
                          <td>{challenge.max_score}</td>
                          <td
                            className={`bg-${
                              challenge.score && challenge.submissions
                                ? styleScore(
                                    challenge.score,
                                    challenge.max_score
                                  )
                                : "body"
                            }`}
                          >
                            {round2dp(challenge.score)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Container>
              </Tab>
            )}
            <Tab eventKey="leaderboard" title="Leaderboard">
              {complete && sortedLeaderboard !== undefined && (
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
                        {contest.data.ends === null ||
                        Date.now() < contest.data.ends ||
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
                    challenges={contest.data.challenges}
                  />
                </Container>
              )}
            </Tab>
          </Tabs>
        )}
      </Container>
    </>
  );
};

export default ContestPage;
