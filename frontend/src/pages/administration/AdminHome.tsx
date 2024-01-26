import {
  Button,
  Container,
  Form,
  Modal,
  Tab,
  Table,
  Tabs,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { handleError } from "~components/Error";
import { assertQuerySuccess, useNavigateShim } from "~utils/helper";
import { trpc } from "~utils/trpc";
import style from "../../styles.module.css";
import TimeDisplay from "~components/TimeDisplay";
import React, { useEffect, useState } from "react";
import { inferRouterInputs } from "@trpc/server";
import { AppRouter } from "../../../../backend/src/app";
import { SubmitHandler, UseFormReturn, useForm } from "react-hook-form";
import {
  ContestCreateData,
  NewContestModal,
} from "~components/Administration/NewContestModal";
import {
  ChallengeCreateData,
  NewChallengeModal,
} from "~components/Administration/NewChallengeModal";

export const AdminHome = () => {
  const { hash } = useLocation();
  const navigate = useNavigateShim();
  const utils = trpc.useUtils();

  const [now, setNow] = useState(new Date());
  const [showNewContestModal, setShowNewContestModal] = useState(false);
  const [showNewChallengeModal, setShowNewChallengeModal] = useState(false);
  const contestForm = useForm<ContestCreateData>();
  const challengeForm = useForm<ChallengeCreateData>();

  useEffect(() => {
    const ticker = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(ticker);
  }, []);

  const queryUser = trpc.auth.validate.useQuery();
  const queryAuthorization = trpc.auth.isAdmin.useQuery(undefined, {
    enabled: queryUser.isSuccess,
  });
  const queryContests = trpc.contest.list.useQuery();
  const queryChallenges = trpc.challenge.list.useQuery(undefined, {
    enabled: queryAuthorization.isSuccess,
  });

  const mutateNewContest = trpc.admin.createContest.useMutation();
  const mutateNewChallenge = trpc.admin.createChallenge.useMutation();

  try {
    assertQuerySuccess(queryUser, "ERR_AUTH");
    assertQuerySuccess(queryAuthorization, "ERR_NOT_ADMIN");
    assertQuerySuccess(queryContests, "ERR_CONTEST_LIST_FETCH");
    assertQuerySuccess(queryChallenges, "ERR_CHAL_LIST_FETCH");
  } catch (e) {
    return handleError(e);
  }

  async function submitNewContest(data: ContestCreateData) {
    try {
      await mutateNewContest.mutateAsync(data);
      utils.contest.invalidate();
      navigate(`./contest/${data.id}`);
    } catch (e) {
      console.error(e);
    }
  }

  async function submitNewChallenge(data: ChallengeCreateData) {
    try {
      await mutateNewChallenge.mutateAsync(data);
      utils.challenge.invalidate();
      navigate(`./challenge/${data.id}`);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <NewContestModal
        show={showNewContestModal}
        setShow={setShowNewContestModal}
        onSubmit={submitNewContest}
        form={contestForm}
      />

      <NewChallengeModal
        show={showNewChallengeModal}
        setShow={setShowNewChallengeModal}
        onSubmit={submitNewChallenge}
        form={challengeForm}
      />

      <Container>
        <h1>Administration</h1>
        <Tabs defaultActiveKey={hash === "" ? "contests" : hash.slice(1)}>
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
                        navigate(`./contest/${x.id.replaceAll("/", ":")}`);
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
          <Tab eventKey="challenges" title="Challenges">
            <Button
              onClick={() => setShowNewChallengeModal(true)}
              className="mt-4"
            >
              New challenge
            </Button>
            <Table bordered className="w-75 mt-3">
              <thead>
                <tr>
                  <th>Challenge name</th>
                </tr>
              </thead>
              <tbody>
                {queryChallenges.data.map((challenge) => (
                  <tr
                    onClick={() => navigate(`./challenge/${challenge.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{challenge.title}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab>
        </Tabs>
      </Container>
    </>
  );
};
