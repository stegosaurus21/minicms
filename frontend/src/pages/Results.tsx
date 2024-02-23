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
import { useParams } from "react-router-dom";
import {
  ArrayElement,
  assertQuerySuccess,
  parseMemory,
  prettyDate,
  round2dp,
  styleScore,
  styleStatus,
  useNavigateShim,
} from "utils/helper";
import style from "../styles.module.css";
import { Buffer } from "buffer";
import { authedWS, trpc, trpcVanilla } from "utils/trpc";
import { error, handleError } from "components/Error";
import { useEffect, useState } from "react";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "../../../backend/src/app";
import { Observable } from "@trpc/server/observable";

type UnwrapObservable<A> = A extends Observable<infer T, unknown> ? T : never;
type TestResult = UnwrapObservable<
  inferRouterOutputs<AppRouter>["results"]["getTests"]
>;

const Results = () => {
  const navigate = useNavigateShim();
  const params = useParams();

  try {
    if (!params["contest"]) throw error("ERR_CONTEST_MISSING");
    if (!params["challenge"]) throw error("ERR_CHAL_MISSING");
    if (!params["submission"]) throw error("ERR_SUBMISSION_MISSING");
  } catch (e) {
    return handleError(e);
  }

  const paramContestName = (params["contest"] || "").replace(":", "/");
  const paramChallengeName = (params["challenge"] || "").replace(":", "/");
  const paramSubmissionName = (params["submission"] || "").replace(":", "/");

  const queryUser = trpc.auth.validate.useQuery();
  const queryChallenge = trpc.challenge.get.useQuery(
    { contest: paramContestName, challenge: paramChallengeName },
    {
      enabled: paramContestName !== "" && paramChallengeName !== "",
    }
  );
  const queryValidation = trpc.results.validate.useQuery({
    submission: paramSubmissionName,
  });
  const querySubmission = trpc.results.getSubmission.useQuery({
    contest: paramContestName,
    challenge: paramChallengeName,
    submission: paramSubmissionName,
  });
  const queryScore = trpc.results.getScore.useQuery(
    {
      submission: paramSubmissionName,
    },
    {
      enabled: querySubmission.isSuccess,
      trpc: { context: { skipBatch: true } },
    }
  );

  const [results, setResults] = useState<Map<number, Map<number, TestResult>>>(
    new Map()
  );
  const [compileOutput, setCompileOutput] = useState<string>("");
  const subscribeTests = trpc.results.getTests.useSubscription(
    authedWS({
      submission: paramSubmissionName,
    }),
    {
      enabled: queryChallenge.isSuccess && querySubmission.isSuccess,
      onData(data) {
        if (!compileOutput) setCompileOutput(data.compile_output);
        setResults((prev) => {
          prev.get(data.task_number)?.set(data.test_number, data);
          return new Map(prev);
        });
      },
    }
  );

  useEffect(() => {
    if (!queryChallenge.data) return;
    const newMap = new Map<number, Map<number, TestResult>>();
    queryChallenge.data.challenge.tasks.forEach((task) => {
      newMap.set(task.task_number, new Map<number, TestResult>());
      task.tests.forEach((test) =>
        newMap.get(task.task_number)?.set(test.test_number, {
          task_number: task.task_number,
          test_number: test.test_number,
          token: "",
          time: 0,
          memory: 0,
          status: "",
          compile_output: "",
        })
      );
    });
    setResults(newMap);
  }, [queryChallenge.isSuccess]);

  try {
    assertQuerySuccess(queryUser, "ERR_AUTH");
  } catch (e) {
    return handleError(e);
  }

  if (!queryUser.data.isLoggedIn) {
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

  try {
    assertQuerySuccess(queryValidation, "ERR_SUBMISSION_404");
    if (!queryValidation.data.isViewable) throw error("ERR_SUBMISSION_404");
    assertQuerySuccess(queryChallenge, "ERR_CHAL_404");
    assertQuerySuccess(querySubmission, "ERR_SUBMISSION_FETCH");
  } catch (e) {
    return handleError(e);
  }

  const { challenge, max_score } = queryChallenge.data;
  const { index, time, source } = querySubmission.data;
  const { tasks } = challenge;
  const totalWeight = tasks.reduce((p, n) => p + n.weight, 0);

  function subtaskMaxScore(task: ArrayElement<typeof tasks>) {
    return (task.weight / totalWeight) * max_score;
  }

  function subtaskScore(task: ArrayElement<typeof tasks>) {
    const taskResults = Array.from(
      results.get(task.task_number)?.values() || []
    );

    if (taskResults.find((x) => x.status === "") || taskResults.length === 0)
      return null;

    const acceptedTasks = taskResults.filter(
      (x) => x.status === "Accepted"
    ).length;
    switch (task.type) {
      case "BATCH":
        if (acceptedTasks === taskResults.length) return subtaskMaxScore(task);
        return 0;

      case "INDIVIDUAL":
        return (subtaskMaxScore(task) * acceptedTasks) / taskResults.length;

      default:
        return null;
    }
  }

  return (
    <Container>
      <span className={style.returnLink} onClick={() => navigate("./..")}>
        {"<"} Back to challenge
      </span>
      <h1 className="mt-1">
        {challenge.title}{" "}
        {queryScore.isSuccess ? (
          <Badge
            bg={styleScore(queryScore.data, queryChallenge.data.max_score)}
          >{`${round2dp(queryScore.data)}/${
            queryChallenge.data.max_score
          }`}</Badge>
        ) : (
          <Spinner as="span" animation="border"></Spinner>
        )}
      </h1>
      <p className={style.bold}>
        Submission #{index + 1} - {prettyDate(time)}
      </p>
      <Accordion
        alwaysOpen
        defaultActiveKey={tasks.map((x) => `${x.task_number + 1}`)}
      >
        {tasks
          .toSorted((a, b) => a.task_number - b.task_number)
          .map((task) => (
            <Accordion.Item eventKey={`${task.task_number + 1}`}>
              <Accordion.Header>
                <h5>
                  {tasks.length > 1
                    ? `Subtask ${task.task_number + 1}`
                    : "Tests"}
                  <span> </span>
                  {task.type === "BATCH" ? (
                    <OverlayTrigger
                      trigger="hover"
                      placement="top"
                      overlay={
                        <Popover>
                          <Popover.Header>Batch subtask</Popover.Header>
                          <Popover.Body>
                            Batch subtasks require all tests to be accepted for
                            the submission, otherwise the subtask is worth zero
                            points.
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
                  {subtaskScore(task) !== null ? (
                    <Badge
                      bg={styleScore(subtaskScore(task), subtaskMaxScore(task))}
                    >{`${round2dp(subtaskScore(task))}/${subtaskMaxScore(
                      task
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
                    {Array.from(results.get(task.task_number)?.values() || [])
                      .toSorted((a, b) => a.test_number - b.test_number)
                      .map((result) => {
                        return (
                          <tr>
                            <td>{`${result.test_number + 1}`}</td>
                            <td>{`${
                              result.status ? `${result.time || ""} s` : ""
                            }`}</td>
                            <td>{`${
                              result.status
                                ? parseMemory(result.memory) || ""
                                : ""
                            }`}</td>
                            <td className={`bg-${styleStatus(result.status)}`}>
                              {result.status ? (
                                result.status
                              ) : (
                                <>
                                  <Spinner
                                    as="span"
                                    size="sm"
                                    animation="border"
                                  ></Spinner>{" "}
                                  Judging
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </Accordion.Body>
            </Accordion.Item>
          ))}
      </Accordion>
      <h2 className="mt-3">Compilation output</h2>
      <Container className="border mt-3 p-2">
        {compileOutput ? (
          <pre>
            <samp>{Buffer.from(compileOutput, "base64").toString()}</samp>
          </pre>
        ) : (
          <>
            <Spinner as="span" size="sm" animation="border"></Spinner> Checking
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
};

export default Results;
