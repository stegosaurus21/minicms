import { format } from "date-fns";
import React, { useEffect, useState, useContext } from "react";
import { Button, Container, Table, Form, Row, Badge } from "react-bootstrap";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { TokenProp } from "src/App";
import { prettyDate, round2dp, styleScore } from "src/utils/helper";
import { config } from "../config";
import style from "../styles.module.css";
import "katex/dist/katex.min.css";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import { Api } from "src/Api";
import { ChallengeExternal, Language, Submission } from "src/interface";
import ChallengeSubmissions from "src/components/Challenges/ChallengeSubmissions";
import { trpc } from "src/utils/trpc";
import ErrorPage from "src/components/Error";

const Challenge = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [file, setFile] = useState<File>();
  const [submissionLanguage, setSubmissionLanguage] = useState<string>("");
  const [validated, setValidated] = useState(false);
  const [pastSubmissions, setPastSubmissions] = useState<Submission[] | null>(
    null
  );
  const [score, setScore] = useState<number>(0);
  const [showUnofficial, setShowUnofficial] = useState<boolean>();

  const queryContestName = (params["contest"] || "").replace(":", "/");
  const queryChallengeName = (params["challenge"] || "").replace(":", "/");

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

  const populate = () => {
    Api.getChallengeResults(params["contest"], params["challenge"])
      .then((res) => {
        setScore(
          res.submissions.reduce(
            (prev: number, next: Submission) =>
              prev > next.score ? prev : next.score,
            0
          )
        );
        setPastSubmissions(res.submissions);
      })
      .catch((err) => console.log(err));

    Api.getLanguages()
      .then((res) => {
        setLanguages(res);
      })
      .catch((err) => console.log(err));
  };

  const user = trpc.auth.validate.useQuery();
  useEffect(() => {
    if (user.status !== "success") return;
    populate();
  }, [user.status]);
  const validation = trpc.challenge.validate.useQuery(
    { contest: queryContestName, challenge: queryChallengeName },
    { enabled: queryContestName !== "" && queryChallengeName !== "" }
  );
  const challenge = trpc.challenge.get.useQuery(
    { contest: queryContestName, challenge: queryChallengeName },
    { enabled: validation.isSuccess && validation.data.isViewable }
  );

  if (user.isLoading) return <></>;
  if (user.isError)
    return <ErrorPage message="A server authentication error occurred." />;

  if (validation.isLoading) return <></>;
  if (validation.isError) return <ErrorPage message="Challenge not found." />;

  if (challenge.isLoading) return <></>;
  if (challenge.isError)
    return (
      <ErrorPage message="A server occurred when fetching the challenge." />
    );

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

  return (
    <>
      <Container>
        <span className={style.returnLink} onClick={() => navigate("./..")}>
          {"<"} Back to contest
        </span>
        <ReactMarkdown
          components={{
            h1: (node, ...props) => (
              <h1>
                {node.children[0]}{" "}
                <Badge
                  bg={
                    pastSubmissions === null || pastSubmissions.length === 0
                      ? "secondary"
                      : styleScore(score, challenge.data.max_score)
                  }
                >{`${round2dp(score)}/${challenge.data.max_score}`}</Badge>
              </h1>
            ),
          }}
        >
          {challenge.data.description.header}
        </ReactMarkdown>
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
                  {languages.map((x) => (
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
          {challenge.data.description.body}
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
              max_score={challenge.data.max_score}
              showUnofficial={showUnofficial}
            />
          </>
        )}
      </Container>
    </>
  );
};

export default Challenge;
