import { Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { refreshToast } from "~utils/helper";
import { trpc } from "~utils/trpc";

const Home = () => {
  return (
    <>
      <Container className="justify-content-center text-center">
        <p>Welcome to MiniCMS!</p>
      </Container>
    </>
  );
};

export default Home;
