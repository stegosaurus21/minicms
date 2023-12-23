import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import style from "../styles.module.css";
import { LoadingMarker } from "utils/helper";

export const errorMessages = {
  "ERR_AUTH": "A server authentication error occurred.",
  "ERR_CHAL_MISSING": "No challenge was provided.",
  "ERR_CHAL_404": "The challenge was not found.",
  "ERR_CHAL_FETCH": "A server error occurred when fetching the challenge.",
  "ERR_CONTEST_MISSING": "No contest was provided.",
  "ERR_CONTEST_404": "The contest was not found.",
  "ERR_CONTEST_FETCH": "A server error occurred when fetching the contest.",
  "ERR_CONTEST_LIST_FETCH":
    "A server error occurred when fetching the contest list.",
  "ERR_RESULTS_FETCH": "A server error occurred when fetching contest results.",
  "ERR_LANG_FETCH":
    "A server error occurred when fetching submission languages.",
  "ERR_LEADERBOARD_FETCH":
    "A server error occurred when fetching the contest leaderboard.",
  "ERR_SUBMISSION_MISSING": "No submission was provided.",
  "ERR_SUBMISSION_404": "The submission was not found.",
  "ERR_SUBMISSION_FETCH":
    "A server error occurred when fetching the submission.",
  "ERR_GENERAL": "An error occurred.",
};

const ErrorPage = (props: { messageId: string }) => {
  const navigate = useNavigate();
  return (
    <Container>
      <span className={style.returnLink} onClick={() => navigate("./..")}>
        {"<"} Back
      </span>
      <h1>Error</h1>
      <p>Code: {props.messageId}</p>
      <p>
        {errorMessages[props.messageId as keyof typeof errorMessages] ||
          "An unknown error occurred."}
      </p>
    </Container>
  );
};

export function handleError(e: any) {
  if (e instanceof LoadingMarker) {
    return <></>;
  } else if (e instanceof KnownError) {
    return <ErrorPage messageId={e.message} />;
  } else {
    throw e;
  }
}

export class KnownError extends Error {}

export function error(messageId: keyof typeof errorMessages) {
  return new KnownError(messageId);
}

export default ErrorPage;
