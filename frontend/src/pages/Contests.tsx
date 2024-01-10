import { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ContestMeta } from "interface";
import style from "../styles.module.css";
import TimeDisplay from "components/TimeDisplay";
import { trpc } from "utils/trpc";
import { error, handleError } from "components/Error";
import { assertQuerySuccess } from "utils/helper";

const Contests = () => {
  const [now, setNow] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const ticker = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(ticker);
  }, []);

  const contests = trpc.contest.list.useQuery();

  try {
    assertQuerySuccess(contests, "ERR_CONTEST_LIST_FETCH");
  } catch (e) {
    return handleError(e);
  }

  return (
    <>
      <Container>
        <h1>Contests</h1>
        {contests.data.length === 0 && (
          <p>There are no available contests yet.</p>
        )}
        {contests.data.length !== 0 && (
          <Table bordered className="w-75">
            <thead>
              <tr>
                <th>Contest</th>
                <th>Opens in</th>
                <th>Closes in</th>
              </tr>
            </thead>
            <tbody>
              {contests.data.map((x) => (
                <tr
                  className={style.tableRow}
                  onClick={() => {
                    navigate(`${x.id.replaceAll("/", ":")}`);
                  }}
                >
                  <td>{x.title}</td>
                  <td>
                    <TimeDisplay
                      refDate={now}
                      displayDate={x.start_time}
                      nullStr="Opened"
                      pastStr="Opened"
                    />
                  </td>
                  <td>
                    <TimeDisplay
                      refDate={now}
                      displayDate={x.end_time}
                      nullStr="Never"
                      pastStr="Already closed"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
    </>
  );
};

export default Contests;
