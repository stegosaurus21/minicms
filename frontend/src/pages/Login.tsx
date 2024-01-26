import { useState } from "react";
import { Form, Button, Container, Alert, Modal } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";

import styles from "../styles.module.css";
import { trpc } from "utils/trpc";
import { error, handleError } from "components/Error";
import { assertQuerySuccess, useNavigateShim } from "utils/helper";
import { passwordOk } from "./Register";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigateShim();
  const [params, setParams] = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const login = trpc.auth.login.useMutation();
  const changePassword = trpc.auth.changePassword.useMutation();

  const utils = trpc.useUtils();
  const user = trpc.auth.validate.useQuery();

  function redirect() {
    navigate(params.get("url") ? `/contests/${params.get("url")}` : "/");
  }

  function canSubmit() {
    return (
      passwordOk(newPassword) &&
      newPassword === confirmNewPassword &&
      newPassword !== password
    );
  }

  try {
    assertQuerySuccess(user, "ERR_AUTH");
  } catch (e) {
    return handleError(e);
  }

  if (user.data.isLoggedIn && !showPasswordModal) {
    redirect();
    return <></>;
  }

  return (
    <Container>
      <Modal
        show={showPasswordModal}
        onHide={redirect}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Reset password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please change your password to continue.</p>
          <Form>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                type="password"
                onChange={(event) => setNewPassword(event.target.value)}
              />
              <Form.Text className="text-danger">
                {newPassword === "" || passwordOk(newPassword)
                  ? newPassword === password
                    ? "New password cannot be the same as existing password."
                    : ""
                  : "Password must be at least 6 characters."}
              </Form.Text>
            </Form.Group>
            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                required
                type="password"
                onChange={(event) => setConfirmNewPassword(event.target.value)}
              />
              <Form.Text
                className="text-danger"
                hidden={
                  confirmNewPassword === "" ||
                  newPassword === confirmNewPassword
                }
              >
                Passwords do not match
              </Form.Text>
            </Form.Group>
            <Button
              variant="primary"
              onClick={() => {
                changePassword
                  .mutateAsync({ password: newPassword })
                  .then(() => {
                    setShowPasswordModal(false);
                    redirect();
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              }}
              disabled={!canSubmit()}
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

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
                .then(({ token, forceResetPassword }) => {
                  localStorage.setItem("token", token);
                  utils.auth.invalidate();
                  if (forceResetPassword) {
                    setShowPasswordModal(true);
                  } else {
                    redirect();
                  }
                })
                .catch((e) => {
                  toast.error((e as Error).message, { toastId: "login" });
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
