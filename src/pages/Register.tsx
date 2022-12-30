import React, { useEffect, useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "../styles.module.css";
import { config } from '../config';
import { onLoggedIn } from "src/helper";

const Register = () => {
  const [token, setToken] = useState(localStorage.getItem('token') as string);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirm, setConfirm] = useState("");

  const validUserNameFormat = () => {
    return /^([A-Za-z0-9-]){3,}$/.test(username);
  }

  const passwordOk = () => {
    return password.length >= 6;
  }

  const canSubmit = () => {
    return validUserNameFormat() && passwordOk() && password === confirm;
  };

  const updatePassword = (value: string) => {
    setPassword(value);
  }

  const register = async () => {
    const result = await fetch(`http://${config.BACKEND_URL}:${config.BACKEND_PORT}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "username": username,
        "password": password
      })
    });

    if (!result.ok) {
      const message = `An error has occured: ${result.status}`;
			throw new Error(message);
    } else {
      navigate("/auth/login");
    }
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
            type="text"
            onChange={event => setUsername(event.target.value)} />
          <Form.Text className="text-danger" hidden={username === "" || validUserNameFormat()}>
            Username must be at least 3 characters and contain only alphanumerics and dashes 
          </Form.Text>
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            required
            type="password"
            onChange={event => updatePassword(event.target.value)} />
          <Form.Text className="text-danger">
            {(password === "" || passwordOk()) ? " " : "Password must be at least 6 characters."} 
          </Form.Text>
        </Form.Group>
        <Form.Group>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            required
            type="password"
            onChange={event => setConfirm(event.target.value)} />
          <Form.Text className="text-danger" hidden={confirm === "" || password === confirm}>
            Passwords do not match
          </Form.Text>
        </Form.Group>
        <br/>
        <Form.Group>
          <Button
            variant="primary"
            onClick={() => register()}
            disabled={!canSubmit()}>
            Submit
          </Button>
          <Button
            variant="link"
            type="button"
            onClick={() => navigate("/auth/login")}>
            Return to login
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default Register;
