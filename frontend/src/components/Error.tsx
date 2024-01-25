import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import style from "../styles.module.css";
import { LoadingMarker } from "utils/helper";

export const errorMessages = {
  "ERR_404": "Page not found.",
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
  "ERR_NOT_ADMIN": "You do not have access to administrator controls",
  "ERR_CHAL_LIST_FETCH":
    "A server error occurred when fetching the challenge list.",
};

export type ErrorCode = keyof typeof errorMessages;

const ErrorPage = (props: { messageId: ErrorCode }) => {
  const navigate = useNavigate();
  return (
    <Container>
      <span className={style.returnLink} onClick={() => navigate("./..")}>
        {"<"} Back
      </span>
      <h1>Error</h1>
      <p>Code: {props.messageId}</p>
      <p>{errorMessages[props.messageId]}</p>
    </Container>
  );
};

export function handleError(e: any) {
  if (e instanceof LoadingMarker) {
    return <></>;
  } else if (e instanceof KnownError) {
    return <ErrorPage messageId={e.messageId} />;
  } else {
    throw e;
  }
}

export class KnownError extends Error {
  messageId: ErrorCode;

  constructor(messageId: ErrorCode) {
    super(errorMessages[messageId]);
    this.messageId = messageId;
  }
}

export function error(messageId: ErrorCode) {
  return new KnownError(messageId);
}

export default ErrorPage;
