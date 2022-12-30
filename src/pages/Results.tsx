import React, { useEffect, useState } from 'react';
import { Accordion, Badge, Button, Container, Spinner, Table } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { TokenProp } from 'src/App';
import { makeBackendRequest, onLoggedIn, parseMemory, prettyDate, round2dp, styleScore, styleStatus } from 'src/helper';
import { config } from '../config';
import style from '../styles.module.css';
import { Buffer } from 'buffer';
import { Submission } from './Challenge';

interface Scoring {
  tests: number,
  scoring?: { weight: number, mode: string, tasks: number[] }[]
}

interface Result {
  time: number | null,
  memory: number | null,
  status: string,
  compile_output: string
};

const Results = (props: TokenProp) => {
  const token = props.token;
  const navigate = useNavigate();
  const params = useParams();

  const [results, setResults] = useState<Result[]>([]);
  const [problemName, setProblemName] = useState<string>('');
  const [score, setScore] = useState<number | null>(null);
  const [maxScore, setMaxScore] = useState<number>(0);
  const [index, setIndex] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [username, setUsername] = useState<string | null>(null);
  const [viewable, setViewable] = useState<boolean | null>(null);
  const [scoring, setScoring] = useState<Scoring>();
  const [source, setSource] = useState<string>('');

  const subtaskMaxScore = (task: number) => {
    if (scoring === undefined || scoring.scoring === undefined) return 0;
    const totalWeight = scoring.scoring.reduce((prev, next) => prev + next.weight, 0);
    return maxScore * scoring.scoring[task].weight / totalWeight;
  }

  const subtaskScore = (task: number) => {
    if (scoring === undefined || scoring.scoring === undefined) return 0;
    if (scoring.scoring[task].tasks.find(x => !results[x] || results[x].status === 'Checking') !== undefined) return null;
    const acceptedTasks = scoring.scoring[task].tasks.filter(x => results[x].status === 'Accepted').length;
    if (scoring.scoring[task].mode === 'BATCH') {
      if (acceptedTasks === scoring.scoring[task].tasks.length) return subtaskMaxScore(task);
      return 0;
    }
    return subtaskMaxScore(task) * acceptedTasks / scoring.scoring[task].tasks.length
  }

  const populate = () => {
    makeBackendRequest('GET', '/results/validate', token, {
      contest: params['contest'],
      challenge: params['challenge'],
      submission: params['submission']
    })
    .catch((err) => { setViewable(false); throw new Error('Cannot view submission.'); } )
    .then(() => {
      return makeBackendRequest('GET', '/challenge/scoring', token, {
        contest: params['contest'],
        challenge: params['challenge']
      });
    })
    .then((res) => {
      setIndex(res.index);
      setProblemName(res.name);
      setMaxScore(res.total_score);
      setScoring(res.scoring);
      
      setResults(Array.from({ length: res.scoring.tests }, () => ({ time: null, memory: null, status: 'Checking', compile_output: ''})));
      Array.from({ length: res.scoring.tests }, (_, i) => 
        makeBackendRequest('GET', `/results/tests/${i}`, token, {
          submission: params['submission']
        })
        .then((res) => { setResults(results => [...results.slice(0, i), res, ...results.slice(i + 1)]); })
        .catch((err) => console.log(err))
      );
      return makeBackendRequest('GET', '/results/challenge', token, {
        contest: params['contest'],
        challenge: params['challenge']
      });
    }).then((res) => {
      const thisSubmission = res.submissions.find((x: Submission) => x.token === params['submission']);
      setIndex(thisSubmission.index);
      setTime(thisSubmission.time);
      setViewable(true);
      return makeBackendRequest('GET', '/results/source', token, {
        submission: params['submission']
      });
    }).then((res) => {
      setSource(res.src);
      return makeBackendRequest('GET', '/results', token, {
        submission: params['submission']
      });
    })
    .then((res) => {
      setScore(res.score);
    })
    .catch((err) => console.log(err));
  }

  useEffect(() => {
    onLoggedIn(token, (username: string) => {
      setUsername(username);
      populate();
    }, () => setUsername(''));
  }, []);

  if (viewable === false) {
    return (<>
      <Container>
        <br/>
        <h2>Submission not found.</h2>
        <br/>
        <Button onClick={() => navigate('/contests')}>Back to contests</Button>
      </Container>
    </>);
  }

  if (username === '') {
    return (
      <Container>
        <p>You need to be signed in to view this submission.</p>
        <Button onClick={() => navigate({ pathname: '/auth/login', search: `?url=${params['contest']}/${params['challenge']}/${params['submission']}`})}>Login / Register</Button>
      </Container>
    );
  }
  if (viewable === true && scoring !== undefined) {
    return (
      <Container>
        <span className={style.returnLink} onClick={() => navigate('./..')}>{'<'} Back to challenge</span>
        <h1 className="mt-1">{problemName} {score === null ? <Spinner as="span" animation="border"></Spinner> : <Badge bg={styleScore(score, maxScore)}>{`${round2dp(score)}/${maxScore}`}</Badge>}</h1>
        <p className={style.bold}>Submission #{index} - {prettyDate(time)}</p>
        {scoring.scoring
        ? <Accordion alwaysOpen defaultActiveKey={scoring.scoring.map((_, i) => `${i + 1}`)}>
          {scoring.scoring.map((x, i) => <Accordion.Item eventKey={`${i + 1}`}>
            <Accordion.Header><h5>{`Subtask ${i + 1}`} {
              subtaskScore(i) !== null
              ? <Badge bg={styleScore(subtaskScore(i), subtaskMaxScore(i))}>{`${round2dp(subtaskScore(i))}/${subtaskMaxScore(i)}`}</Badge>
              : <Spinner as="span" size="sm" animation="border"></Spinner>
            }</h5></Accordion.Header>
            <Accordion.Body>
              <Table bordered>
                <thead>
                  <tr>
                    <th>Test number</th>
                    <th>Runtime</th>
                    <th>Memory used</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {x.tasks.map((x, j) => <tr>
                    <td>{`${j + 1}`}</td>
                    <td>{`${results[x] ? `${(results[x].time || '')} s` : ''}`}</td>
                    <td>{`${results[x] ? (parseMemory(results[x].memory) || '') : ''}`}</td>
                    <td className={`bg-${styleStatus(results[x] ? results[x].status : '')}`}>{(results[x] && results[x].status !== 'Checking') ? results[x].status : <><Spinner as="span" size="sm" animation="border"></Spinner> Checking</>}</td>
                  </tr>)}
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>)}
        </Accordion>
        : <Table bordered>
          <thead>
            <tr>
              <th>Test number</th>
              <th>Runtime</th>
              <th>Memory used</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: scoring.tests }, (_, i) => <tr>
              <td>{`${i + 1}`}</td>
              <td>{`${results[i] ? `${(results[i].time || '')} s` : ''}`}</td>
              <td>{`${results[i] ? (parseMemory(results[i].memory) || '') : ''}`}</td>
              <td className={`bg-${styleStatus(results[i] ? results[i].status : '')}`}>{(results[i] && results[i].status !== 'Checking') ? results[i].status : <><Spinner as="span" size="sm" animation="border"></Spinner> Checking</>}</td>
            </tr>)}
          </tbody>
        </Table>}
        <h2 className='mt-3'>Compilation output</h2>
        <Container className='border mt-3 p-2'>
          {(results[0] && results[0].compile_output !== '') ? <pre><samp>{Buffer.from(results[0].compile_output, 'base64').toString()}</samp></pre> : <><Spinner as="span" size="sm" animation="border"></Spinner> Checking</>}
        </Container>
        <h2 className='mt-3'>Source code</h2>
        <Container className='border mt-3 p-2'>
          <pre><code>{source}</code></pre>
        </Container>
      </Container>
    )
  }

  return <></>;
};

export default Results;
