import { useEffect, useState } from "react";
import {
  Accordion,
  Badge,
  Button,
  Container,
  OverlayTrigger,
  Popover,
  Spinner,
  Table,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import {
  error,
  parseMemory,
  prettyDate,
  round2dp,
  styleScore,
  styleStatus,
} from "src/utils/helper";
import style from "../styles.module.css";
import { Buffer } from "buffer";
import { Api } from "src/Api";
import { Result, Submission } from "src/interface";
import { trpc } from "src/utils/trpc";

const Results = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [results, setResults] = useState<Result[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [index, setIndex] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [viewable, setViewable] = useState<boolean | null>(null);
  const [source, setSource] = useState<string>("");

  const queryContestName = (params["contest"] || "").replace(":", "/");
  const queryChallengeName = (params["challenge"] || "").replace(":", "/");

  const populate = () => {
    Api.resultsValidate(
      params["contest"],
      params["challenge"],
      params["submission"]
    )
      .catch((err) => {
        setViewable(false);
        throw new Error("Cannot view submission.");
      })
      .then((res) => {
        setResults(
          Array.from({ length: res.tasks }, () => ({
            token: "",
            time: -1,
            memory: -1,
            status: "Checking",
            compile_output: "",
          }))
        );
        Array.from({ length: res.tasks }, (_, i) =>
          Api.getTestResults(params["submission"], i)
            .then((res) => {
              setResults((results) => [
                ...results.slice(0, i),
                res,
                ...results.slice(i + 1),
              ]);
            })
            .catch((err) => console.log(err))
        );

        return Api.getChallengeResults(params["contest"], params["challenge"]);
      })
      .then((res) => {
        const thisSubmission = res.submissions.find(
          (x: Submission) => x.token === params["submission"]
        );
        if (thisSubmission === undefined)
          throw new Error("Couldn't find submission");
        setIndex(thisSubmission.index);
        setTime(thisSubmission.time);
        setViewable(true);
        return Api.getSubmissionSource(params["submission"]);
      })
      .then((res) => {
        setSource(res.src);
        return Api.pollSubmissionResult(params["submission"]);
      })
      .then((res) => {
        console.log(res);
        setScore(res.score);
      })
      .catch((err) => console.log(err));
  };

  const user = trpc.auth.validate.useQuery();
  const challenge = trpc.challenge.get.useQuery(
    { contest: queryContestName, challenge: queryChallengeName },
    { enabled: queryContestName !== "" && queryChallengeName !== "" }
  );

  useEffect(() => {
    if (user.status !== "success") return;
    populate();
  }, [user.status]);
  if (user.isLoading) return <></>;
  if (user.isError) throw error("ERR_AUTH");

  if (challenge.isLoading) return <></>;
  if (challenge.isError) throw error("ERR_CHAL_FETCH");

  const scoring = challenge === null ? null : challenge.data.scoring;

  const subtaskMaxScore = (task: number) => {
    if (challenge === null || scoring === null) return 0;
    const totalWeight = scoring.reduce((prev, next) => prev + next.weight, 0);
    return (challenge.data.max_score * scoring[task].weight) / totalWeight;
  };

  const subtaskScore = (task: number) => {
    if (scoring === undefined || scoring === null) return 0;
    if (
      scoring[task].tasks.find(
        (x) => !results[x] || results[x].status === "Checking"
      ) !== undefined
    )
      return null;
    const acceptedTasks = scoring[task].tasks.filter(
      (x) => results[x].status === "Accepted"
    ).length;
    if (scoring[task].mode === "BATCH") {
      if (acceptedTasks === scoring[task].tasks.length)
        return subtaskMaxScore(task);
      return 0;
    }
    return (subtaskMaxScore(task) * acceptedTasks) / scoring[task].tasks.length;
  };

  if (viewable === false) {
    return (
      <>
        <Container>
          <br />
          <h2>Submission not found.</h2>
          <br />
          <Button onClick={() => navigate("/contests")}>
            Back to contests
          </Button>
        </Container>
      </>
    );
  }

  if (!user.data.isLoggedIn) {
    return (
      <Container>
        <p>You need to be signed in to view this submission.</p>
        <Button
          onClick={() =>
            navigate({
              pathname: "/auth/login",
              search: `?url=${params["contest"]}/${params["challenge"]}/${params["submission"]}`,
            })
          }
        >
          Login / Register
        </Button>
      </Container>
    );
  }
  if (viewable === true && challenge !== null) {
    return (
      <Container>
        <span className={style.returnLink} onClick={() => navigate("./..")}>
          {"<"} Back to challenge
        </span>
        <h1 className="mt-1">
          {challenge.data.name}{" "}
          {score === null ? (
            <Spinner as="span" animation="border"></Spinner>
          ) : (
            <Badge
              bg={styleScore(score, challenge.data.max_score)}
            >{`${round2dp(score)}/${challenge.data.max_score}`}</Badge>
          )}
        </h1>
        <p className={style.bold}>
          Submission #{index} - {prettyDate(time)}
        </p>
        {scoring ? (
          <Accordion
            alwaysOpen
            defaultActiveKey={scoring.map((_, i) => `${i + 1}`)}
          >
            {scoring.map((x, i) => (
              <Accordion.Item eventKey={`${i + 1}`}>
                <Accordion.Header>
                  <h5>
                    {`Subtask ${i + 1}`} <span> </span>
                    {x.mode === "BATCH" ? (
                      <OverlayTrigger
                        trigger="hover"
                        placement="top"
                        overlay={
                          <Popover>
                            <Popover.Header>Batch subtask</Popover.Header>
                            <Popover.Body>
                              Batch subtasks require all tests to be accepted
                              for the submission, otherwise the subtask is worth
                              zero points.
                            </Popover.Body>
                          </Popover>
                        }
                      >
                        <Badge className="bg-secondary text-light">Batch</Badge>
                      </OverlayTrigger>
                    ) : (
                      <></>
                    )}
                    <span> </span>
                    {subtaskScore(i) !== null ? (
                      <Badge
                        bg={styleScore(subtaskScore(i), subtaskMaxScore(i))}
                      >{`${round2dp(subtaskScore(i))}/${subtaskMaxScore(
                        i
                      )}`}</Badge>
                    ) : (
                      <Spinner as="span" size="sm" animation="border"></Spinner>
                    )}
                  </h5>
                </Accordion.Header>
                <Accordion.Body>
                  <Table bordered>
                    <thead>
                      <tr>
                        <th>Test number</th>
                        <th>Runtime</th>
                        <th>Memory used</th>
                        <th>Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {x.tasks.map((x, j) => (
                        <tr>
                          <td>{`${j + 1}`}</td>
                          <td>{`${
                            results[x] ? `${results[x].time || ""} s` : ""
                          }`}</td>
                          <td>{`${
                            results[x]
                              ? parseMemory(results[x].memory) || ""
                              : ""
                          }`}</td>
                          <td
                            className={`bg-${styleStatus(
                              results[x] ? results[x].status : ""
                            )}`}
                          >
                            {results[x] && results[x].status !== "Checking" ? (
                              results[x].status
                            ) : (
                              <>
                                <Spinner
                                  as="span"
                                  size="sm"
                                  animation="border"
                                ></Spinner>{" "}
                                Checking
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        ) : (
          <Table bordered>
            <thead>
              <tr>
                <th>Test number</th>
                <th>Runtime</th>
                <th>Memory used</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: challenge.data.tasks }, (_, i) => (
                <tr>
                  <td>{`${i + 1}`}</td>
                  <td>{`${results[i] ? `${results[i].time || ""} s` : ""}`}</td>
                  <td>{`${
                    results[i] ? parseMemory(results[i].memory) || "" : ""
                  }`}</td>
                  <td
                    className={`bg-${styleStatus(
                      results[i] ? results[i].status : ""
                    )}`}
                  >
                    {results[i] && results[i].status !== "Checking" ? (
                      results[i].status
                    ) : (
                      <>
                        <Spinner
                          as="span"
                          size="sm"
                          animation="border"
                        ></Spinner>{" "}
                        Checking
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <h2 className="mt-3">Compilation output</h2>
        <Container className="border mt-3 p-2">
          {results[0] && results[0].compile_output !== "" ? (
            <pre>
              <samp>
                {Buffer.from(results[0].compile_output, "base64").toString()}
              </samp>
            </pre>
          ) : (
            <>
              <Spinner as="span" size="sm" animation="border"></Spinner>{" "}
              Checking
            </>
          )}
        </Container>
        <h2 className="mt-3">Source code</h2>
        <Container className="border mt-3 p-2 mb-3">
          <pre>
            <code>{source}</code>
          </pre>
        </Container>
      </Container>
    );
  }

  return <></>;
};

export default Results;
