import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";

import styles from "../styles.module.css";
import { trpc } from "utils/trpc";
import { error, handleError } from "components/Error";
import { assertQuerySuccess } from "utils/helper";

const Login = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = trpc.auth.login.useMutation();

  const utils = trpc.useContext();
  const user = trpc.auth.validate.useQuery();

  try {
    assertQuerySuccess(user, "ERR_AUTH");
  } catch (e) {
    return handleError(e);
  }

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
                  utils.auth.invalidate();
                  navigate(
                    params.get("url") ? `/contests/${params.get("url")}` : "/"
                  );
                })
                .catch((e) => {})
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
