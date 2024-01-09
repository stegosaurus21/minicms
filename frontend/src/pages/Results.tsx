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
  ArrayElement,
  LoadingMarker,
  assertAllQueriesSuccess,
  assertQuerySuccess,
  parseMemory,
  prettyDate,
  round2dp,
  styleScore,
  styleStatus,
} from "utils/helper";
import style from "../styles.module.css";
import { Buffer } from "buffer";
import { trpc } from "utils/trpc";
import { error, handleError } from "components/Error";

const Results = () => {
  const navigate = useNavigate();
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
    { trpc: { context: { skipBatch: true } } }
  );
  const queryResults = trpc.useQueries((t) => {
    const tests = queryChallenge.data?.challenge.tests || [];
    return tests.map((x) =>
      t.results.getTest(
        {
          submission: paramSubmissionName,
          task: x.task_number,
          test: x.test_number,
        },
        {
          enabled: queryChallenge.isSuccess,
          placeholderData: {
            token: "",
            task_number: x.task_number,
            test_number: x.test_number,
            time: 0,
            memory: 0,
            status: "Judging",
            compile_output: "",
          },
        }
      )
    );
  });

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
    const queryTaskTests = queryResults.filter(
      (x) => x.data?.task_number === task.task_number
    );

    try {
      assertAllQueriesSuccess(queryTaskTests);
    } catch (e) {
      if (e instanceof LoadingMarker) {
        return null;
      } else {
        throw e;
      }
    }

    const acceptedTasks = queryTaskTests.filter(
      (x) => x.data.status === "Accepted"
    ).length;
    switch (task.type) {
      case "BATCH":
        if (acceptedTasks === queryTaskTests.length)
          return subtaskMaxScore(task);
        return 0;

      case "INDIVIDUAL":
        return (subtaskMaxScore(task) * acceptedTasks) / queryTaskTests.length;

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
        {tasks.map((task) => (
          <Accordion.Item eventKey={`${task.task_number + 1}`}>
            <Accordion.Header>
              <h5>
                {tasks.length > 1 ? `Subtask ${task.task_number + 1}` : "Tests"}
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
                  {queryResults
                    .filter((x) => x.data?.task_number === task.task_number)
                    .map((result, j) => {
                      return (
                        <tr>
                          <td>{`${j + 1}`}</td>
                          <td>{`${
                            result.isSuccess
                              ? `${result.data.time || ""} s`
                              : ""
                          }`}</td>
                          <td>{`${
                            result.isSuccess
                              ? parseMemory(result.data.memory) || ""
                              : ""
                          }`}</td>
                          <td
                            className={`bg-${styleStatus(
                              result.isSuccess ? result.data.status : "Judging"
                            )}`}
                          >
                            {result.isSuccess ? (
                              result.data.status
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
        {queryResults[0].isSuccess &&
        queryResults[0].data.compile_output !== "" ? (
          <pre>
            <samp>
              {Buffer.from(
                queryResults[0].data.compile_output,
                "base64"
              ).toString()}
            </samp>
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
