import { Badge, Table } from "react-bootstrap";
import { prettyDate, round2dp, styleScore } from "utils/helper";
import { Submission } from "interface";
import style from "../../styles.module.css";
import { useNavigate } from "react-router-dom";

const ChallengeSubmissions = (props: {
  submissions: Submission[];
  showUnofficial: boolean | undefined;
  max_score: number;
}) => {
  const { showUnofficial, max_score } = props;
  const submissions = props.submissions
    .filter((x) => x.score != null && (showUnofficial || x.official))
    .sort((a, b) => a.index - b.index);

  const navigate = useNavigate();

  return (
    <Table bordered className="mt-2 w-75">
      <thead>
        <tr>
          <th>Submission #</th>
          <th>Score</th>
          <th>Submission time</th>
        </tr>
      </thead>
      <tbody>
        {submissions.length ? (
          submissions.map((v) => (
            <tr
              className={style.tableRow}
              onClick={() => navigate(`./${v.token}`)}
            >
              <td>
                {v.index}{" "}
                {v.official ? "" : <Badge bg="secondary">Unofficial</Badge>}
              </td>
              <td className={`${styleScore(v.score, max_score, "bg-")}`}>
                {round2dp(v.score)}
              </td>
              <td>{prettyDate(v.time)}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3}>No previous submissions for this challenge.</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default ChallengeSubmissions;
