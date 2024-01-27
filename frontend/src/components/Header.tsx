import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import style from "../styles.module.css";
import { trpc } from "utils/trpc";
import { useNavigateShim } from "~utils/helper";

const Header = () => {
  const navigate = useNavigateShim();
  const utils = trpc.useUtils();
  const user = trpc.auth.validate.useQuery();
  const admin = trpc.auth.isAdmin.useQuery(undefined, {
    enabled: user.isSuccess && user.data.isLoggedIn,
  });
  const logout = trpc.auth.logout.useMutation();

  return (
    <Navbar bg="light">
      <Container>
        <Navbar.Brand onClick={() => navigate("/")}>MiniCMS</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link
            onClick={() => navigate("/admin")}
            hidden={!admin.isSuccess || !admin.data}
          >
            Administration
          </Nav.Link>

          <Nav.Link onClick={() => navigate("/contests")}>Contests</Nav.Link>
          <Nav.Link
            onClick={() =>
              user.isSuccess && !user.data.isLoggedIn
                ? navigate("/auth/login")
                : logout.mutateAsync().then(() => {
                  localStorage.removeItem("token");
                  utils.auth.invalidate();
                  navigate("/");
                })
            }
          >
            {user.isSuccess && !user.data.isLoggedIn
              ? "Login / Register"
              : "Logout"}
          </Nav.Link>
        </Nav>
        {user.isSuccess && user.data.isLoggedIn && (
          <Navbar.Text className="justify-content-end">
            Signed in as{" "}
            <span className={style.bold}>{user.data.username}</span>
          </Navbar.Text>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
