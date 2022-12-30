import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { TokenProp } from 'src/App';
import { makeBackendRequest, prettyDate } from 'src/helper';
import { config } from '../config';
import style from '../styles.module.css';

interface Contest {
  id: string,
  name: string,
  starts: number | null,
  ends: number | null
};

const Contests = (props: TokenProp) => {

  const token = props.token;
  const navigate = useNavigate();

  useEffect(() => {
    makeBackendRequest('GET', '/contest/list', token)
    .then(res => {
      console.log(res.contests);
      setContests(res.contests)
    });
  }, []);
  
  const [contests, setContests] = useState([]);

  return (
    <>
      <Container className="justify-content-center text-center">
        <br/>
        {contests.length !== 0 && <Table bordered className="w-75">
          <thead>
            <tr>
              <th>Contest</th>
              <th>Opens</th>
              <th>Closes</th>
            </tr>
          </thead>
          <tbody>
            {contests.map((x: Contest) => <tr className={style.tableRow} onClick={() => {navigate(`${x.id.replaceAll('/',':')}`)}}>
              <td>{x.name}</td>
              <td>{x.starts ? prettyDate(x.starts) : 'Always opened'}</td>
              <td>{x.ends ? prettyDate(x.ends) : 'Never closes'}</td>
            </tr>)}
          </tbody>
        </Table>}
      </Container>
    </>
  )
};

export default Contests;
