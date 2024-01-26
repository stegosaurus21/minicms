import { useRef, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import ErrorPage, { error, handleError } from "~components/Error";
import { assertQuerySuccess, useNavigateShim } from "~utils/helper";
import { trpc } from "~utils/trpc";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "../../../../backend/src/app";
import style from "../../styles.module.css";
import { DateTimeControl } from "~components/Administration/DateTimeControl";
import { Typeahead } from "react-bootstrap-typeahead";
import TypeaheadType from "react-bootstrap-typeahead/types/core/Typeahead";
import {
  ChallengeCreateData,
  NewChallengeModal,
} from "~components/Administration/NewChallengeModal";
import { toast } from "react-toastify";

type ContestData = inferRouterOutputs<AppRouter>["contest"]["getAdmin"];

export const AdminContest = () => {
  const params = useParams();
  const utils = trpc.useUtils();
  const navigate = useNavigateShim();

  if (!params["contest"]) throw error("ERR_CONTEST_MISSING");
  const paramContestId = params["contest"].replace(":", "/");

  const challengeRef = useRef<TypeaheadType>(null);

  const [newChallengeId, setNewChallengeId] = useState("");

  const queryUser = trpc.auth.validate.useQuery();
  const queryAuthorization = trpc.auth.isAdmin.useQuery(undefined, {
    enabled: queryUser.isSuccess && queryUser.data.isLoggedIn,
  });
  const queryContest = trpc.contest.getAdmin.useQuery(
    { contest: paramContestId },
    { enabled: queryAuthorization.isSuccess, staleTime: Infinity }
  );
  const queryChallenges = trpc.challenge.list.useQuery(undefined, {
    enabled: queryAuthorization.isSuccess,
  });

  const mutateContest = trpc.admin.updateContest.useMutation();

  const { control, register, getValues, setValue, handleSubmit } =
    useForm<ContestData>({
      values: queryContest.data,
      resetOptions: {
        keepDirtyValues: true,
        keepErrors: true,
      },
    });

  async function submitForm(data: ContestData) {
    try {
      await mutateContest.mutateAsync({
        target: { id: paramContestId },
        data: {
          contest: data,
          challenges: data.challenges.map((x) => ({
            challenge: { connect: { id: x.challenge_id } },
            max_score: x.max_score,
          })),
        },
      });
      utils.contest.invalidate();
      toast.success("Contest updated successfully!", {
        toastId: "contest_update",
      });
    } catch (e) {
      console.error(e);
    }
  }

  try {
    assertQuerySuccess(queryUser, "ERR_AUTH");
  } catch (e) {
    return handleError(e);
  }

  if (!queryUser.data.isLoggedIn)
    return <ErrorPage messageId="ERR_NOT_ADMIN" />;

  try {
    assertQuerySuccess(queryAuthorization, "ERR_NOT_ADMIN");
    assertQuerySuccess(queryContest, "ERR_CONTEST_FETCH");
    assertQuerySuccess(queryChallenges, "ERR_CHAL_LIST_FETCH");
  } catch (e) {
    return handleError(e);
  }

  console.log(newChallengeId);

  return (
    <>
      <Container>
        <span className={style.returnLink} onClick={() => navigate("./../..")}>
          {"<"} Back to admin home
        </span>
        <h1>Edit contest</h1>
        <Form onSubmit={handleSubmit(submitForm)}>
          <h2>Details</h2>
          <Form.Label>Contest ID</Form.Label>
          <Form.Control required type="text" {...register("id")} />
          <Form.Label>Title</Form.Label>
          <Form.Control required type="text" {...register("title")} />
          <Form.Label>Contest start</Form.Label>
          <DateTimeControl
            control={control}
            field="start_time"
            getValues={getValues}
          />
          <Form.Label>Contest ends</Form.Label>
          <DateTimeControl
            control={control}
            field="end_time"
            getValues={getValues}
          />
          <h2>Challenges</h2>
          <div className="border w-75 p-2 mb-3">
            <Form.Label>Add a new challenge:</Form.Label>
            <InputGroup>
              <Typeahead
                options={queryChallenges.data.map((x) => ({
                  id: x.id,
                  label: `${x.title} (${x.id})`,
                }))}
                filterBy={(x: any) =>
                  !getValues("challenges")
                    .map((c) => c.challenge_id)
                    .includes(x.id)
                }
                onChange={(e: any[]) => {
                  setNewChallengeId(e[0] ? e[0].id || e[0] : "");
                }}
                ref={challengeRef}
              />
              <Button
                disabled={newChallengeId === ""}
                onClick={() => {
                  setValue("challenges", [
                    ...getValues("challenges"),
                    { challenge_id: newChallengeId, max_score: 100 },
                  ]);
                  challengeRef.current?.clear();
                }}
              >
                Add
              </Button>
            </InputGroup>
          </div>
          {getValues("challenges") && (
            <Table bordered className="w-75 mt-4">
              <thead>
                <tr>
                  <th>Challenges</th>
                </tr>
              </thead>
              <tbody>
                <Controller
                  control={control}
                  name="challenges"
                  render={({ field: { value } }) => (
                    <>
                      {value.length === 0 && (
                        <tr>
                          <td>This contest has no challenges yet.</td>
                        </tr>
                      )}
                      {value.map(({ challenge_id }) => {
                        console.log(challenge_id);
                        return (
                          <tr>
                            <td>
                              <span>
                                {`${
                                  queryChallenges.data.find(
                                    (x) => x.id === challenge_id
                                  )?.title
                                } (${challenge_id})`}
                              </span>
                              <Button
                                className="ms-4"
                                onClick={() => {
                                  setValue(
                                    "challenges",
                                    getValues("challenges").filter(
                                      (x) => x.challenge_id !== challenge_id
                                    )
                                  );
                                }}
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  )}
                />
              </tbody>
            </Table>
          )}
          <br />
          <Button type="submit">Save</Button>
        </Form>
      </Container>
    </>
  );
};
