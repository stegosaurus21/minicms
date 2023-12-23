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

  const queryContestName = (params["contest"] || "").replace(":", "/");
  const queryChallengeName = (params["challenge"] || "").replace(":", "/");
  const querySubmissionName = (params["submission"] || "").replace(":", "/");

  const user = trpc.auth.validate.useQuery();
  const challenge = trpc.challenge.get.useQuery(
    { contest: queryContestName, challenge: queryChallengeName },
    {
      enabled: queryContestName !== "" && queryChallengeName !== "",
    }
  );
  const submissionValidation = trpc.results.validate.useQuery({
    submission: querySubmissionName,
  });
  const submissionInfo = trpc.results.getSubmission.useQuery({
    contest: queryContestName,
    challenge: queryChallengeName,
    submission: querySubmissionName,
  });
  const score = trpc.results.getScore.useQuery(
    {
      submission: querySubmissionName,
    },
    { trpc: { context: { skipBatch: true } } }
  );
  const taskResults = trpc.useQueries((t) =>
    Array.from({ length: challenge.data?.tasks || 0 }, (_, i) =>
      t.results.getTest(
        { submission: querySubmissionName, test: i },
        { enabled: challenge.isSuccess }
      )
    )
  );

  try {
    assertQuerySuccess(user, "ERR_AUTH");
  } catch (e) {
    return handleError(e);
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

  try {
    assertQuerySuccess(submissionValidation, "ERR_SUBMISSION_404");
    if (!submissionValidation.data.isViewable)
      throw error("ERR_SUBMISSION_404");
    assertQuerySuccess(challenge, "ERR_CHAL_404");
    assertQuerySuccess(submissionInfo, "ERR_SUBMISSION_FETCH");
  } catch (e) {
    return handleError(e);
  }

  const scoring = challenge.data.scoring;
  const index = submissionInfo.data.index;
  const time = submissionInfo.data.time;
  const source = submissionInfo.data.source;

  const subtaskMaxScore = (task: number) => {
    const totalWeight = scoring.reduce((prev, next) => prev + next.weight, 0);
    return (challenge.data.max_score * scoring[task].weight) / totalWeight;
  };

  const subtaskScore = (task: number) => {
    if (scoring === undefined || scoring === null) return 0;

    try {
      assertAllQueriesSuccess(taskResults);
    } catch (e) {
      if (e instanceof LoadingMarker) {
        return null;
      } else {
        throw e;
      }
    }

    const acceptedTasks = scoring[task].tasks.filter(
      (x) => taskResults[x].data.status === "Accepted"
    ).length;
    if (scoring[task].mode === "BATCH") {
      if (acceptedTasks === scoring[task].tasks.length)
        return subtaskMaxScore(task);
      return 0;
    }
    return (subtaskMaxScore(task) * acceptedTasks) / scoring[task].tasks.length;
  };

  return (
    <Container>
      <span className={style.returnLink} onClick={() => navigate("./..")}>
        {"<"} Back to challenge
      </span>
      <h1 className="mt-1">
        {challenge.data.name}{" "}
        {score.isSuccess ? (
          <Badge
            bg={styleScore(score.data, challenge.data.max_score)}
          >{`${round2dp(score.data)}/${challenge.data.max_score}`}</Badge>
        ) : (
          <Spinner as="span" animation="border"></Spinner>
        )}
      </h1>
      <p className={style.bold}>
        Submission #{index} - {prettyDate(time)}
      </p>
      <Accordion
        alwaysOpen
        defaultActiveKey={scoring.map((_, i) => `${i + 1}`)}
      >
        {scoring.map((x, i) => (
          <Accordion.Item eventKey={`${i + 1}`}>
            <Accordion.Header>
              <h5>
                {scoring.length > 1 ? `Subtask ${i + 1}` : "Tasks"}
                <span> </span>
                {x.mode === "BATCH" ? (
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
                  {x.tasks.map((x, j) => {
                    const result = taskResults[x];
                    return (
                      <tr>
                        <td>{`${j + 1}`}</td>
                        <td>{`${
                          result.isSuccess ? `${result.data.time || ""} s` : ""
                        }`}</td>
                        <td>{`${
                          result.isSuccess
                            ? parseMemory(result.data.memory) || ""
                            : ""
                        }`}</td>
                        <td
                          className={`bg-${styleStatus(
                            result.isSuccess ? result.data.status : "Checking"
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
                              Checking
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
        {taskResults[0].isSuccess &&
        taskResults[0].data.compile_output !== "" ? (
          <pre>
            <samp>
              {Buffer.from(
                taskResults[0].data.compile_output,
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
