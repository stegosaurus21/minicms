import { Button, Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { handleError } from "~components/Error";
import { assertQuerySuccess } from "~utils/helper";
import { trpc } from "~utils/trpc";
import style from "../../styles.module.css";
import TimeDisplay from "~components/TimeDisplay";
import { useEffect, useState } from "react";

export const AdminHome = () => {
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const ticker = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(ticker);
  }, []);

  const user = trpc.auth.validate.useQuery();
  const authorization = trpc.auth.isAdmin.useQuery(undefined, {
    enabled: user.isSuccess,
  });
  const contests = trpc.contest.list.useQuery();

  try {
    assertQuerySuccess(user, "ERR_AUTH");
    assertQuerySuccess(authorization, "ERR_NOT_ADMIN");
    assertQuerySuccess(contests, "ERR_CONTEST_LIST_FETCH");
  } catch (e) {
    return handleError(e);
  }

  return (
    <>
      <Container>
        <h1>Administration</h1>
        <h2>Contests</h2>
        <Button>New contest</Button>
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
