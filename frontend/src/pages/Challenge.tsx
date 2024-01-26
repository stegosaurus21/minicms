import { useState } from "react";
import { Button, Container, Table, Form, Badge } from "react-bootstrap";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import {
  assertQuerySuccess,
  parseMemory,
  round2dp,
  styleScore,
  useNavigateShim,
} from "utils/helper";
import style from "../styles.module.css";
import "katex/dist/katex.min.css";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import ChallengeSubmissions from "components/Challenges/ChallengeSubmissions";
import { trpc } from "utils/trpc";
import { error, handleError } from "components/Error";

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
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex]}
          components={{
            table: ({ node, ...props }) => (
              <Table className="w-75" bordered {...props}></Table>
            ),
            td: ({ node, ...props }) => (
              <td>
                <pre>
                  <code>{props.children[0]}</code>
                </pre>
              </td>
            ),
          }}
        >
          {challenge.description +
            "\n\n## Input\n\n" +
            challenge.input_format +
            "\n\n## Output\n\n" +
            challenge.output_format}
        </ReactMarkdown>
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
