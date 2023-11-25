import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import style from "../styles.module.css";
import { trpc } from "src/utils/trpc";

const Header = () => {
  const navigate = useNavigate();
  const utils = trpc.useContext();
  const user = trpc.auth.validate.useQuery();
  const logout = trpc.auth.logout.useMutation();

  return (
    <Navbar sticky="top" bg="light" expand="lg">
      <Container>
        <Navbar.Brand
          as="span"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          MiniCMS
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link
            as="span"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/contests")}
          >
            Contests
          </Nav.Link>
          <Nav.Link
            as="span"
            style={{ cursor: "pointer" }}
            onClick={() =>
              user.isSuccess && !user.data.isLoggedIn
                ? navigate("/auth/login")
                : logout.mutateAsync().then(() => {
                    utils.auth.invalidate();
                    localStorage.removeItem("token");
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
