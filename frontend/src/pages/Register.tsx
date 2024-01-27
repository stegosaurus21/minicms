import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { trpc } from "utils/trpc";
import { handleError } from "components/Error";
import {
  assertQuerySuccess,
  refreshToast,
  useNavigateShim,
} from "utils/helper";
import { toast } from "react-toastify";

export function passwordOk(password: string) {
  return password.length >= 6;
}

const Register = () => {
  const navigate = useNavigateShim();

  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirm, setConfirm] = useState("");

  const validUserNameFormat = () => {
    return /^([A-Za-z0-9-]){3,}$/.test(username);
  };

  const canSubmit = () => {
    return (
      validUserNameFormat() && passwordOk(password) && password === confirm
    );
  };

  const register = trpc.auth.register.useMutation();
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
            type="text"
            onChange={(event) => setUsername(event.target.value)}
          />
          <Form.Text
            className="text-danger"
            hidden={username === "" || validUserNameFormat()}
          >
            Username must be at least 3 characters and contain only
            alphanumerics and dashes
          </Form.Text>
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            required
            type="password"
            onChange={(event) => setPassword(event.target.value)}
          />
          <Form.Text className="text-danger">
            {password === "" || passwordOk(password)
              ? " "
              : "Password must be at least 6 characters."}
          </Form.Text>
        </Form.Group>
        <Form.Group>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            required
            type="password"
            onChange={(event) => setConfirm(event.target.value)}
          />
          <Form.Text
            className="text-danger"
            hidden={confirm === "" || password === confirm}
          >
            Passwords do not match
          </Form.Text>
        </Form.Group>
        <br />
        <Form.Group>
          <Button
            variant="primary"
            onClick={() => {
              register
                .mutateAsync({ username: username, password: password })
                .then(() => navigate("/auth/login"))
                .catch((e) => {
                  refreshToast("error", (e as Error).message, "register");
                });
            }}
            disabled={!canSubmit()}
          >
            Submit
          </Button>
          <Button
            variant="link"
            type="button"
            onClick={() => navigate("/auth/login")}
          >
            Return to login
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default Register;
