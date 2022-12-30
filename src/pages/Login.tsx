import React, { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TokenSetterProp } from "src/App";
import { makeBackendRequest, onLoggedIn } from "src/helper";

import styles from "../styles.module.css";

const Login = (props: TokenSetterProp) => {
  const [token, setToken] = props.token;
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const result_token = (await makeBackendRequest('POST', '/auth/login', token, {
      username: username,
      password: password
    })).token;
    setToken(result_token);
  };

  useEffect(() => {
    onLoggedIn(token, (username: string) => navigate('/'));
  }, []);

  return (
    <Container>
      <Form className="w-75">
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            required
            type="email"
            onChange={event => setUsername(event.target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            required
            type="password"
            onChange={event => setPassword(event.target.value)} />
        </Form.Group>
        <br/>
        <Form.Group>
          <Button
            variant="primary"
            onClick={() => login().then(() => navigate(params.get('url') ? `/contests/${params.get('url')}` : '/'))}>
            Submit
          </Button>
          <Button
            variant="link"
            type="button"
            onClick={() => navigate("/auth/register")}>
            Register
          </Button>  
          </Form.Group>
      </Form>
    </Container>
  );
};

export default Login;
