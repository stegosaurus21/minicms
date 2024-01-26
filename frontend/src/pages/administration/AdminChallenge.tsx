import { inferRouterOutputs } from "@trpc/server";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { trpc } from "~utils/trpc";
import { AppRouter } from "../../../../backend/src/app";
import { ArrayElement, assertQuerySuccess } from "~utils/helper";
import ErrorPage, { error, handleError } from "~components/Error";
import { Accordion, Button, Container, Form, Table } from "react-bootstrap";
import style from "../../styles.module.css";
import { useState } from "react";
import {
  EditTestModal,
  TestData,
} from "~components/Administration/EditTestModal";

export type ChallengeData =
  inferRouterOutputs<AppRouter>["challenge"]["getAdmin"];
export type TaskData = ArrayElement<ChallengeData["tasks"]>;

export const AdminChallenge = () => {
  const params = useParams();
  const navigate = useNavigate();

  const utils = trpc.useUtils();

  if (!params["challenge"]) throw error("ERR_CHAL_MISSING");
  const paramChallengeId = params["challenge"].replace(":", "/");

  const queryUser = trpc.auth.validate.useQuery();
  const queryAuthorization = trpc.auth.isAdmin.useQuery(undefined, {
    enabled: queryUser.isSuccess && queryUser.data.isLoggedIn,
  });
  const queryChallenge = trpc.challenge.getAdmin.useQuery(
    { challenge: paramChallengeId },
    { enabled: queryAuthorization.isSuccess, staleTime: Infinity }
  );

  const mutateChallenge = trpc.admin.updateChallenge.useMutation();

  const { control, register, getValues, setValue, handleSubmit } =
    useForm<ChallengeData>({
      values: queryChallenge.data,
      resetOptions: {
        keepDirtyValues: true,
        keepErrors: true,
      },
    });

  const [editingTask, setEditingTask] = useState<number>(0);
  const [editingTestData, setEditingTestData] = useState<TestData | undefined>(
    undefined
  );

  async function submitForm(data: ChallengeData) {
    try {
      await mutateChallenge.mutateAsync({
        target: { id: paramChallengeId },
        data: {
          challenge: data,
          tasks: data.tasks.map((x) => ({
            ...x,
            tests: {
              create: x.tests.map((t) => ({
                ...t,
                challenge: { connect: { id: paramChallengeId } },
              })),
            },
          })),
        },
      });
      await utils.challenge.invalidate();
    } catch (e) {
      console.error(e);
    }
  }

  function updateTest(data: TestData) {
    setValue(`tasks.${editingTask}.tests.${data.test_number}`, data);
    setEditingTestData(undefined);
  }

  function addTask() {
    setValue("tasks", [
      ...getValues("tasks"),
      {
        type: "INDIVIDUAL",
        weight: 1,
        task_number: getValues("tasks").length,
        tests: [],
      },
    ]);
  }

  function addTest(task: TaskData) {
    const newTest = {
      test_number: getValues(`tasks.${task.task_number}.tests`).length,
      input: "",
      output: "",
      comment: "",
      explanation: "",
      is_example: false,
    };
    setValue(`tasks.${task.task_number}.tests`, [...task.tests, newTest]);
    setEditingTask(task.task_number);
    setEditingTestData(newTest);
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
    assertQuerySuccess(queryChallenge, "ERR_CONTEST_FETCH");
  } catch (e) {
    return handleError(e);
  }

  if (getValues("tasks") === undefined) return <></>;

  return (
    <>
      <EditTestModal data={editingTestData} setTestData={updateTest} />
      <Container>
        <span
          className={style.returnLink}
          onClick={() => navigate("/admin#challenges")}
        >
          {"<"} Back to admin home
        </span>
        <h1>Edit challenge</h1>
        <Form onSubmit={handleSubmit(submitForm)}>
          <h2>Details</h2>
          <Form.Label>Challenge ID</Form.Label>
          <Form.Control required type="text" {...register("id")} />
          <Form.Label>Time limit (seconds)</Form.Label>
          <Form.Control required type="number" {...register("time_limit")} />
          <Form.Label>Title</Form.Label>
          <Form.Control required type="text" {...register("title")} />
          <Form.Label>Description</Form.Label>
          <Form.Control
            required
            as="textarea"
            rows={6}
            style={{ resize: "none" }}
            {...register("description")}
          />
          <Form.Label>Input section</Form.Label>
          <Form.Control
            required
            as="textarea"
            rows={3}
            style={{ resize: "none" }}
            {...register("input_format")}
          />
          <Form.Label>Output section</Form.Label>
          <Form.Control
            required
            as="textarea"
            rows={3}
            style={{ resize: "none" }}
            {...register("output_format")}
          />
          <h2>Tasks</h2>
          <Button onClick={addTask}>Add task</Button>
          <Controller
            control={control}
            name={"tasks"}
            render={({ field: { value: tasks } }) => (
              <Accordion
                alwaysOpen
                defaultActiveKey={tasks.map((x) => x.task_number.toString())}
              >
                {tasks.map((task) => (
                  <Controller
                    control={control}
                    name={`tasks.${task.task_number}`}
                    render={({ field: { value: task } }) => {
                      return (
                        <Accordion.Item eventKey={task.task_number.toString()}>
                          <Accordion.Header>
                            {`Task ${task.task_number + 1}`}
                          </Accordion.Header>
                          <Accordion.Body>
                            <Button
                              onClick={() => {
                                addTest(task);
                              }}
                            >
                              Add test
                            </Button>
                            <Table bordered>
                              <thead>
                                <tr>
                                  <th>Tasks</th>
                                </tr>
                              </thead>
                              <Controller
                                control={control}
                                name={`tasks.${task.task_number}.tests`}
                                render={({ field: { value: tests } }) => (
                                  <tbody>
                                    {tests.map((test) => (
                                      <tr>
                                        <td
                                          onClick={() => {
                                            setEditingTask(task.task_number);
                                            setEditingTestData(test);
                                          }}
                                        >
                                          {test.test_number}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                )}
                              />
                            </Table>
                          </Accordion.Body>
                        </Accordion.Item>
                      );
                    }}
                  />
                ))}
              </Accordion>
            )}
          />
          <br />
          <Button type="submit">Save</Button>
        </Form>
      </Container>
    </>
  );
};
