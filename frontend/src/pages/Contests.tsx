import { format, formatDistanceToNowStrict } from "date-fns";
import React, { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { TokenProp } from "src/App";
import { prettyDate, prettyInterval } from "src/utils/helper";
import { ContestMeta } from "src/interface";
import { config } from "../config";
import style from "../styles.module.css";
import { Api } from "src/Api";
import TimeDisplay from "src/components/TimeDisplay";
import { trpc } from "src/utils/trpc";
import ErrorPage from "src/components/Error";

const Contests = () => {
  // const [contests, setContests] = useState<ContestMeta[]>([]);
  const [now, setNow] = useState(Date.now());
  const navigate = useNavigate();

  useEffect(() => {
    /* Api.getContestList().then((res) => {
      setContests(res.contests);
    }); */
    const ticker = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(ticker);
  }, []);

  const contests = trpc.contest.list.useQuery();
  if (contests.isLoading) return <></>;
  if (contests.isError)
    return <ErrorPage message="A server error occurred."></ErrorPage>;

  return (
    <>
      <Container>
        <h1>Contests</h1>
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
              {contests.data.map((x: ContestMeta) => (
                <tr
                  className={style.tableRow}
                  onClick={() => {
                    navigate(`${x.id.replaceAll("/", ":")}`);
                  }}
                >
                  <td>{x.name}</td>
                  <td>
                    <TimeDisplay
                      refDate={now}
                      displayDate={x.starts}
                      nullStr="Opened"
                      pastStr="Opened"
                    />
                  </td>
                  <td>
                    <TimeDisplay
                      refDate={now}
                      displayDate={x.ends}
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
