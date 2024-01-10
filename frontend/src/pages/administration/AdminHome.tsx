import {
  Button,
  Container,
  Form,
  Modal,
  Tab,
  Table,
  Tabs,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { handleError } from "~components/Error";
import { assertQuerySuccess } from "~utils/helper";
import { trpc } from "~utils/trpc";
import style from "../../styles.module.css";
import TimeDisplay from "~components/TimeDisplay";
import { useEffect, useState } from "react";
import { inferRouterInputs } from "@trpc/server";
import { AppRouter } from "../../../../backend/src/app";
import { useForm } from "react-hook-form";

type ContestCreateData = inferRouterInputs<AppRouter>["admin"]["createContest"];

export const AdminHome = () => {
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const [now, setNow] = useState(new Date());
  const [showNewContestModal, setShowNewContestModal] = useState(false);
  const { register, handleSubmit } = useForm<ContestCreateData>();

  useEffect(() => {
    const ticker = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(ticker);
  }, []);

  const queryUser = trpc.auth.validate.useQuery();
  const queryAuthorization = trpc.auth.isAdmin.useQuery(undefined, {
    enabled: queryUser.isSuccess,
  });
  const queryContests = trpc.contest.list.useQuery();
  const mutateNewContest = trpc.admin.createContest.useMutation();

  try {
    assertQuerySuccess(queryUser, "ERR_AUTH");
    assertQuerySuccess(queryAuthorization, "ERR_NOT_ADMIN");
    assertQuerySuccess(queryContests, "ERR_CONTEST_LIST_FETCH");
  } catch (e) {
    return handleError(e);
  }

  async function submitForm(data: ContestCreateData) {
    try {
      await mutateNewContest.mutateAsync(data);
      utils.contest.invalidate();
      navigate(`./${data.id}`);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <Modal
        show={showNewContestModal}
        onHide={() => setShowNewContestModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>New contest</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Choose an ID and title for your new contest.</p>
          <Form onSubmit={handleSubmit(submitForm)}>
            <Form.Label>ID string</Form.Label>
            <Form.Control type="text" required {...register("id")} />
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" required {...register("title")} />
            <Form.Text muted>You will be able to change these later.</Form.Text>
            <br />
            <Button type="submit">Create</Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Container>
        <h1>Administration</h1>
        <Tabs>
          <Tab eventKey="contests" title="Contests">
            <Button
              onClick={() => setShowNewContestModal(true)}
              className="mt-4"
            >
              New contest
            </Button>
            {queryContests.data.length === 0 && (
              <p>There are no contests created yet.</p>
            )}
            {queryContests.data.length !== 0 && (
              <Table bordered className="w-75 mt-3">
                <thead>
                  <tr>
                    <th>Contest</th>
                    <th>Opens in</th>
                    <th>Closes in</th>
                  </tr>
                </thead>
                <tbody>
                  {queryContests.data.map((x) => (
                    <tr
                      className={style.tableRow}
                      onClick={() => {
                        navigate(`${x.id.replaceAll("/", ":")}`);
                      }}
                    >
                      <td>{x.title}</td>
                      <td>
                        <TimeDisplay
                          refDate={now}
                          displayDate={x.start_time}
                          nullStr="Opened"
                          pastStr="Opened"
                        />
                      </td>
                      <td>
                        <TimeDisplay
                          refDate={now}
                          displayDate={x.end_time}
                          nullStr="Never"
                          pastStr="Already closed"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Tab>
          <Tab eventKey="challenges" title="Challenges"></Tab>
        </Tabs>
      </Container>
    </>
  );
};
