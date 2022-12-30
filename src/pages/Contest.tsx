import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Button, Container, Tab, Table, Tabs } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { TokenProp } from 'src/App';
import { makeBackendRequest, onLoggedIn, round2dp, styleScore } from 'src/helper';
import { config } from '../config';
import style from '../styles.module.css';

interface Challenge {
  name: string,
  id: string,
  score: number,
  submissions: number
};

interface LeaderboardEntry {
  name: string,
  scores: {score: number, count: number}[]
};

const Contest = (props: TokenProp) => {

  const token = props.token;
  const navigate = useNavigate();
  const params = useParams();
  
  const [username, setUsername] = useState<string | null>(null);
  const [joined, setJoined] = useState<boolean | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [scores, setScores] = useState<string[]>([]);
  const [contestExists, setContestExists] = useState<boolean | null>(null);
  const [contestName, setContestName] = useState<string>('');
  const [contestText, setContestText] = useState<string>('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[] | null>(null);
  const [maxScores, setMaxScores] = useState<number[] | null>(null);
  const [contestStarts, setContestStarts] = useState<number | null>(null);
  const [contestEnds, setContestEnds] = useState<number | null>(null);

  const populate = () => {
    makeBackendRequest('GET', '/contest/validate', token, {
      contest: params['contest']
    })
    .catch((err) => { setJoined(false); throw new Error('Cannot view contest.'); })
    .then(() => {
      return makeBackendRequest('GET', '/contest/challenges', token, {
        contest: params['contest']
      });
    })
    .then((res) => {
      setChallenges(res.challenges);
      setJoined(true);
      Promise.all(res.challenges.map((challenge: Challenge) => makeBackendRequest('GET', '/results/challenge', token, {
        contest: params['contest'],
        challenge: challenge.id,
        score: true
      })))
      .then((res) => setScores(res.map(x => `${round2dp(x.score)}`)));
    })
    .catch((err) => console.log(err));
  }

  useEffect(() => {
    makeBackendRequest('GET', '/contest', token, {
      contest: params['contest']
    })
    .then((res) => {
      setContestExists(true);
      setContestName(res.name);
      setContestText(res.text);
      setContestStarts(res.starts);
      setContestEnds(res.ends);
    })
    .catch(() => {
      setContestExists(false);
    });
    onLoggedIn(token, (username: string) => {
      setUsername(username);
      populate();
    }, () => setUsername(''));
    makeBackendRequest('GET', '/results/leaderboard', token, {
      contest: params['contest']
    }).then((res) => {
      console.log(res);
      setLeaderboard(res.leaderboard);
      setMaxScores(res.max_scores);
    });
  }, []);

  if (contestExists === false) {
    return (
      <Container>
        <br/>
        <h2>Contest not found.</h2>
        <br/>
        <Button onClick={() => navigate('/contests')}>Back to contests</Button>
      </Container>
    );
  }

  if (username !== null) {
    return (<>
      <Container>
        <span className={style.returnLink} onClick={() => navigate('./..')}>{'<'} Back to contests</span>
        <h2>{contestName}</h2>
        <p>{contestText}</p>
        {username !== '' && joined === false && <>
          <hr/>
          <p>Join the contest to participate and view problems.</p>
          <Button onClick={() => {
            makeBackendRequest('POST', '/contest/join', token, {
              contest: params['contest']
            }).then(() => populate());
          }}>Join contest</Button>
          <hr/>
        </>}
        {username === '' && <>
          <hr/>
          <p>Sign in to participate and view problems.</p>
          <Button onClick={() => navigate({ pathname: '/auth/login', search: `?url=${params['contest']}`})}>Login / Register</Button>
          <hr/>
        </>}
        {username !== null && <Tabs>
          {username !== '' && joined && <Tab eventKey='challenges' title='Challenges'>
            <Container className='pt-3'>
              <Table bordered className='w-75'>
                <thead>
                  <tr>
                    <th>Challenge</th>
                    <th>Your Submissions</th>
                    <th>Max Score</th>
                    <th>Your Score</th>
                  </tr>
                </thead>
                <tbody>
                  {challenges.map((challenge, i) => <tr className={style.tableRow} onClick={() => navigate(`./${challenge.id.replaceAll('/', ':')}`)}>
                    <td>{challenge.name}</td>
                    <td>{challenge.submissions}</td>
                    <td>{challenge.score}</td>
                    <td className={`bg-${(scores[i] && challenge.submissions) ? styleScore(parseInt(scores[i]), challenge.score) : 'body'}`}>{scores[i]}</td>
                  </tr>)}
                </tbody>
              </Table>
            </Container>
          </Tab>}
          <Tab eventKey='leaderboard' title='Leaderboard'>
            {leaderboard !== null && maxScores !== null && (username === '' || joined !== null) && 
              <Container className='pt-3'>
                {username !== '' && joined === true && <p>Your current position is {`${leaderboard.findIndex(x => x.name === username) + 1}${['st', 'nd', 'rd', 'th'][Math.min(4, leaderboard.findIndex(x => x.name === username) % 10)]}`} out of {leaderboard.length} participants.</p>}
                <Table bordered className='w-75'>
                  <thead>
                    <tr>
                      <th>Place</th>
                      <th>User</th>
                      <th>{`Total score (/${maxScores.reduce((prev, next) => prev + next, 0)})`}</th>
                      {(username === '' || joined === false) 
                        ? maxScores.map((_, i) => <th>{`Challenge ${i + 1} (/${maxScores[i]})`}</th>)
                        : challenges.map((c, i) => <th>{`${c.name} (/${maxScores[i]})`}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.length > 0
                    ? leaderboard.map(((x, i) => <tr className={`${x.name === username ? 'bg-secondary text-light' : ''}`}>
                      <td>{i + 1}</td>
                      <td>{x.name}</td>
                      <td>{x.scores.reduce((prev, next) => prev + next.score, 0)}</td>
                      {x.scores.map((x, i) => <td className={(x.count > 0) ? `bg-${styleScore(x.score, maxScores[i])}` : ''}>{x.score}</td>)}
                    </tr>))
                    : <tr><td colSpan={maxScores.length + 3}>No participants found for this contest.</td></tr>}
                  </tbody>
                </Table>
              </Container>
            }
          </Tab>
        </Tabs>}
      </Container>
    </>);
  }

  return <></>;
};

export default Contest;
