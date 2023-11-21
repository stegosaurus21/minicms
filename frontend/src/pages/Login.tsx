import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TokenSetterProp } from "src/App";

import styles from "../styles.module.css";
import { Api } from "src/Api";
import { trpc } from "src/utils/trpc";
import ErrorPage from "src/components/Error";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";

const Login = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = trpc.auth.login.useMutation();

  const utils = trpc.useContext();
  const user = trpc.auth.validate.useQuery();
  if (user.isLoading) return <></>;
  if (user.isError)
    return <ErrorPage message="A server authentication error occurred." />;

  if (user.data.isLoggedIn) {
    navigate("/");
    return <></>;
  }

  return (
    <Container>
      <Form className="w-75">
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            required
            type="email"
            onChange={(event) => setUsername(event.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            required
            type="password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </Form.Group>
        <br />
        <Form.Group>
          <Button
            variant="primary"
            onClick={() =>
              login
                .mutateAsync({ username: username, password: password })
                .then((token) => {
                  localStorage.setItem("token", token);
                  Api.refreshToken();
                  utils.auth.invalidate();
                  navigate(
                    params.get("url") ? `/contests/${params.get("url")}` : "/"
                  );
                })
            }
          >
            Submit
          </Button>
          <Button
            variant="link"
            type="button"
            onClick={() => navigate("/auth/register")}
          >
            Register
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default Login;
