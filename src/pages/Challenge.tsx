import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Button, Container, Table, Form, Row, Badge } from 'react-bootstrap';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { useNavigate, useParams } from 'react-router-dom';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { TokenProp } from 'src/App';
import { makeBackendRequest, onLoggedIn, prettyDate, round2dp, styleScore, submit } from 'src/helper';
import { config } from '../config';
import style from '../styles.module.css';
import 'katex/dist/katex.min.css';

interface Language {
  id: number, 
  name: string
};

export interface Submission {
  index: number,
  time: number,
  token: string,
  score: number
};

const Challenge = (props: TokenProp) => {

  const token = props.token;
  const navigate = useNavigate();
  const params = useParams();
  
  const [username, setUsername] = useState<string | null>(null);
  const [viewable, setViewable] = useState<boolean | null>(null);
  const [problemText, setProblemText] = useState<string>('');
  const [problemHeader, setProblemHeader] = useState<string>('');
  const [maxScore, setMaxScore] = useState<number>(0);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [file, setFile] = useState<File>();
  const [submissionLanguage, setSubmissionLanguage] = useState<string>('');
  const [validated, setValidated] = useState(false);
  const [pastSubmissions, setPastSubmissions] = useState<Submission[] | null>(null);
  const [score, setScore] = useState<number>(0);

  const submitForm = (event: any) => {
    if (event.target.form.checkValidity()) {
      if (file) submit(params['contest'] || '', params['challenge'] || '', submissionLanguage, file, token)
      .then((res) => {
        navigate(`./${res.token}`);
      })
      .catch((err) => console.log(err));
    }
    setValidated(true);
  };

  const populate = () => {
    makeBackendRequest('GET', '/challenge/validate', token, {
      contest: params['contest'],
      challenge: params['challenge']
    })
    .catch((err) => { setViewable(false); throw new Error('Cannot view challenge.'); } )
    .then(() => {
      return makeBackendRequest('GET', '/challenge', token, {
        contest: params['contest'],
        challenge: params['challenge']
      });
    })
    .then((res) => {
      setMaxScore(res.max_score);
      setProblemText(res.text);
      setProblemHeader(res.header);
    })
    .then(() => makeBackendRequest('GET', '/results/challenge', token, {
        contest: params['contest'],
        challenge: params['challenge']
    }))
    .then((res) => {
      setScore(res.submissions.reduce((prev: number, next: Submission) => (prev > next.score) ? prev : next.score, 0));
      setPastSubmissions(res.submissions);
      setViewable(true);
    })
    .catch((err) => console.log(err));

    makeBackendRequest('GET', '/languages', token)
    .then((res) => setLanguages(res))
    .catch((err) => console.log(err));
  }

  useEffect(() => {
    onLoggedIn(token, (username: string) => {
      setUsername(username);
      populate();
    }, () => setUsername(''));
  }, []);

  if (viewable === false) {
    return (
      <Container>
        <br/>
        <h2>Challenge not found.</h2>
        <br/>
        <Button onClick={() => navigate('/contests')}>Back to contests</Button>
      </Container>
    );
  }

  if (username === '') {
    return (
      <Container>
        <p>You need to be signed in to view this challenge.</p>
        <Button onClick={() => navigate({ pathname: '/auth/login', search: `?url=${params['contest']}/${params['challenge']}`})}>Login / Register</Button>
      </Container>
    );
  }

  if (viewable === true) {
    return (<>
      <Container>
        <span className={style.returnLink} onClick={() => navigate('./..')}>{'<'} Back to contest</span>
        <ReactMarkdown components = {{
          h1: ((node, ...props) => <h1>{node.children[0]} <Badge bg={(pastSubmissions === null || pastSubmissions.length === 0) ? 'secondary' : styleScore(score, maxScore)}>{`${round2dp(score)}/${maxScore}`}</Badge></h1>)
        }}>{problemHeader}</ReactMarkdown>
        {problemHeader !== '' && <div className="border w-75 p-2 mb-3">
          <Form noValidate validated={validated} className="p-2">
            <Form.Label>Submit a solution</Form.Label>
            <Form.Group className="mb-2">
              <Form.Select required onChange={(event) => setSubmissionLanguage(event.target.value)}>
                <option value=''>Select your submission language</option>
                {languages.map(x => <option value={x.id}>{x.name}</option>)}
              </Form.Select>
              <Form.Control required className="mt-3" type="file" onChange={(event) => setFile((event.target as any).files[0])}/>
              <Form.Text muted>Choose the file containing your source code, not a compiled executable.</Form.Text>
            </Form.Group>
            <Button type="button" onClick={submitForm}>Submit</Button>
          </Form>
        </div>}
        <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]} components={{
          table: ({node, ...props}) => <Table className="w-75" bordered {...props}></Table>,
          td: ({node, ...props}) => <td><pre><code>{props.children[0]}</code></pre></td>
        }}>{problemText}</ReactMarkdown>
        {pastSubmissions !== null && <>
          <h2>Previous submissions</h2>
          <Table bordered className="w-75">
            <thead>
              <tr>
                <th>Submission #</th>
                <th>Score</th>
                <th>Submission time</th>
              </tr>
            </thead>
            <tbody>
              {pastSubmissions.length 
                ? pastSubmissions.map((v, i) => <tr className={style.tableRow} onClick={() => navigate(`./${v.token}`)}>
                  <td>{v.index}</td>
                  <td className={`${styleScore(v.score, maxScore, 'bg-')}`}>{round2dp(v.score)}</td>
                  <td>{prettyDate(v.time)}</td>
                </tr>)
                : <tr><td colSpan={3}>No previous submissions for this challenge.</td></tr>}
            </tbody>
          </Table>
        </>}
      </Container>
    </>);
  }

  return <></>;
};

export default Challenge;
