import { useState } from "react";
import { Button, Container, Table, Form, Badge } from "react-bootstrap";
import { useParams } from "react-router-dom";
import {
  assertQuerySuccess,
  parseMemory,
  round2dp,
  styleScore,
  useNavigateShim,
} from "utils/helper";
import style from "../styles.module.css";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import ChallengeSubmissions from "components/Challenges/ChallengeSubmissions";
import { trpc } from "utils/trpc";
import { error, handleError } from "components/Error";
import { Markdown } from "~components/Markdown";

const Challenge = () => {
  const navigate = useNavigateShim();
  const params = useParams();
  const [file, setFile] = useState<File>();
  const [submissionLanguage, setSubmissionLanguage] = useState<string>("");
  const [validated, setValidated] = useState(false);
  const [showUnofficial, setShowUnofficial] = useState<boolean>();

  if (!params["contest"]) throw error("ERR_CONTEST_MISSING");
  if (!params["challenge"]) throw error("ERR_CHAL_MISSING");

  const queryContestName = params["contest"].replace(":", "/");
  const queryChallengeName = params["challenge"].replace(":", "/");

  const submit = trpc.challenge.submit.useMutation();
  const submitForm = async (event: any) => {
    if (event.target.form.checkValidity()) {
      if (file && queryContestName !== "" && queryChallengeName !== "") {
        const result = await submit.mutateAsync({
          contest: queryContestName,
          challenge: queryChallengeName,
          language_id: parseInt(submissionLanguage),
          src: await file.text(),
        });

        navigate(`./${result}`);
      }
    }
    setValidated(true);
  };

  const user = trpc.auth.validate.useQuery();
  const languages = trpc.languages.useQuery();
  const validation = trpc.challenge.validate.useQuery(
    { contest: queryContestName, challenge: queryChallengeName },
    { enabled: queryContestName !== "" && queryChallengeName !== "" }
  );
  const challengeQuery = trpc.challenge.get.useQuery(
    { contest: queryContestName, challenge: queryChallengeName },
    { enabled: validation.isSuccess && validation.data.isViewable }
  );
  const results = trpc.challenge.getResults.useQuery(
    { contest: queryContestName, challenge: queryChallengeName },
    { enabled: validation.isSuccess && validation.data.isViewable }
  );

  try {
    assertQuerySuccess(user, "ERR_AUTH");
    assertQuerySuccess(validation, "ERR_CHAL_404");
    assertQuerySuccess(challengeQuery, "ERR_CHAL_FETCH");
    assertQuerySuccess(results, "ERR_RESULTS_FETCH");
    assertQuerySuccess(languages, "ERR_LANG_FETCH");
  } catch (e) {
    return handleError(e);
  }

  if (!user.data.isLoggedIn) {
    return (
      <Container>
        <p>You need to be signed in to view this challenge.</p>
        <Button
          onClick={() =>
            navigate({
              pathname: "/auth/login",
              search: `?url=${params["contest"]}/${params["challenge"]}`,
            })
          }
        >
          Login / Register
        </Button>
      </Container>
    );
  }

  const pastSubmissions = results.data.submissions;
  const score = results.data.score;
  const { challenge, max_score } = challengeQuery.data;
  const totalWeight = challenge.tasks.reduce((p, n) => p + n.weight, 0);

  return (
    <>
      <Container>
        <span className={style.returnLink} onClick={() => navigate("./..")}>
          {"<"} Back to contest
        </span>
        <h1>
          {challenge.title}{" "}
          <Badge
            bg={
              pastSubmissions === null || pastSubmissions.length === 0
                ? "secondary"
                : styleScore(score, max_score)
            }
          >{`${round2dp(score)}/${max_score}`}</Badge>
        </h1>
        <p>
          <strong>{`Time limit: ${challenge.time_limit}`}</strong>
          <br />
          <strong>{`Memory limit: ${parseMemory(
            challenge.memory_limit
          )}`}</strong>
        </p>
        {
          <div className="border w-75 p-2 mb-3">
            <Form noValidate validated={validated} className="p-2">
              <Form.Label>Submit a solution</Form.Label>
              <Form.Group className="mb-2">
                <Form.Select
                  required
                  onChange={(event) =>
                    setSubmissionLanguage(event.target.value)
                  }
                >
                  <option value="">Select your submission language</option>
                  {languages.data.map((x) => (
                    <option value={x.id}>{x.name}</option>
                  ))}
                </Form.Select>
                <Form.Control
                  required
                  className="mt-3"
                  type="file"
                  onChange={(event) => setFile((event.target as any).files[0])}
                />
                <Form.Text muted>
                  Choose the file containing your source code, not a compiled
                  executable.
                </Form.Text>
              </Form.Group>
              <Button type="button" onClick={submitForm}>
                Submit
              </Button>
            </Form>
          </div>
        }
        <Markdown
          src={
            challenge.description ||
            "This challenge does not have a description."
          }
        />
        {challenge.input_format && (
          <>
            <h2>Input</h2>
            <Markdown src={challenge.input_format} />
          </>
        )}
        {challenge.output_format && (
          <>
            <h2>Output</h2>
            <Markdown src={challenge.output_format} />
          </>
        )}
        {challenge.constraints && (
          <>
            <h2>Constraints</h2>
            <Markdown src={challenge.constraints} />
          </>
        )}

        {challenge.tests.length > 0 && (
          <>
            <h2>Examples</h2>
            <Table className="w-75" bordered>
              <tr>
                <th>Input</th>
                <th>Output</th>
                <th>Explanation</th>
              </tr>
              {challenge.tests.map((x) => (
                <tr>
                  <td>
                    <pre>
                      <code>{x.input}</code>
                    </pre>
                  </td>
                  <td>
                    <pre>
                      <code>{x.output}</code>
                    </pre>
                  </td>
                  <td>
                    {x.explanation ||
                      "No explanation is provided for this example."}
                  </td>
                </tr>
              ))}
            </Table>
          </>
        )}
        <h2>Scoring</h2>
        <p>
          Each test case will be marked as correct if your solution produces the
          right output and incorrect otherwise.
        </p>
        {challenge.tasks.length == 1 ? (
          <p>
            Your score for the challenge is{" "}
            {{
              "INDIVIDUAL": "proportional to the number of correct tests",
              "BATCH": "100% if all tests are correct and 0% otherwise",
            }[challenge.tasks[0].type] ||
              "proportional to the number of correct tests"}
            .
          </p>
        ) : (
          <>
            <p>
              There are {challenge.tasks.length} subtasks, which are scored as
              follows:
            </p>
            <ul>
              {challenge.tasks.map((x, i) => (
                <>
                  <li>
                    Subtask {i + 1} -{" "}
                    {round2dp((x.weight * max_score) / totalWeight)} points{" "}
                    {"("}
                    {x.tests.length}{" "}
                    {{ "INDIVIDUAL": "independent", "BATCH": "batch" }[
                      x.type
                    ] || "independent"}{" "}
                    task{x.tests.length > 1 && "s"}
                    {")"}
                  </li>
                  {x.constraints && <Markdown src={x.constraints} />}
                </>
              ))}
            </ul>
          </>
        )}
        {pastSubmissions !== null && (
          <>
            <h2>Previous submissions</h2>
            <FormCheckInput
              checked={showUnofficial}
              onChange={(event) => {
                setShowUnofficial(event.target.checked);
              }}
            />
            <span> Include unofficial submissions</span>
            <ChallengeSubmissions
              submissions={pastSubmissions}
              max_score={challengeQuery.data.max_score}
              showUnofficial={showUnofficial}
            />
          </>
        )}
      </Container>
    </>
  );
};

export default Challenge;
