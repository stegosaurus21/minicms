import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import style from "../styles.module.css";

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

export class KnownError extends Error {}

export function error(messageId: keyof typeof errorMessages) {
  return new KnownError(messageId);
}

export default ErrorPage;
