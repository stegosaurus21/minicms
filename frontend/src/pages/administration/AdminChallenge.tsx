import { inferRouterOutputs } from "@trpc/server";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { trpc } from "~utils/trpc";
import { AppRouter } from "../../../../backend/src/app";
import {
  ArrayElement,
  assertQuerySuccess,
  parseMemory,
  refreshToast,
  useNavigateShim,
} from "~utils/helper";
import ErrorPage, { error, handleError } from "~components/Error";
import {
  Accordion,
  Button,
  ButtonGroup,
  Container,
  Form,
  Table,
} from "react-bootstrap";
import style from "../../styles.module.css";
import { useState } from "react";
import {
  EditTestModal,
  TestData,
} from "~components/Administration/EditTestModal";
import { IconButton } from "~components/IconButton";
import { FaCheck, FaPencil, FaPlus, FaTrash, FaXmark } from "react-icons/fa6";

export type ChallengeData =
  inferRouterOutputs<AppRouter>["challenge"]["getAdmin"];
export type TaskData = ArrayElement<ChallengeData["tasks"]>;

export const AdminChallenge = () => {
  const params = useParams();
  const navigate = useNavigateShim();

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
      refreshToast(
        "success",
        "Challenge updated successfully!",
        "challenge_update"
      );
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

  function removeTask(task: TaskData) {
    setValue(
      `tasks`,
      getValues(`tasks`).filter((x) => x.task_number !== task.task_number)
    );
  }

  function removeTest(task: TaskData, test: TestData) {
    setValue(
      `tasks.${task.task_number}.tests`,
      getValues(`tasks.${task.task_number}.tests`).filter(
        (x) => x.test_number !== test.test_number
      )
    );
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
                className="mt-4"
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
                            {`Task ${task.task_number + 1} (${
                              task.tests.length
                            } tests)`}
                          </Accordion.Header>
                          <Accordion.Body>
                            <Form.Label>Task weight</Form.Label>
                            <Form.Control
                              required
                              className="w-75"
                              type="number"
                              min={1}
                              max={100}
                              {...register(`tasks.${task.task_number}.weight`)}
                            />
                            <Form.Label>Task type</Form.Label>
                            <Form.Select
                              className="w-75"
                              {...register(`tasks.${task.task_number}.type`)}
                            >
                              <option value="INDIVIDUAL">
                                Individually scored tests
                              </option>
                              <option value="BATCH">
                                Tests batch scored as a task
                              </option>
                            </Form.Select>
                            <Button className="mt-4" variant="danger">
                              Delete task
                            </Button>
                            <Table bordered className="mt-4">
                              <thead>
                                <tr>
                                  <th>
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                      }}
                                    >
                                      <span>Tests</span>
                                      <IconButton
                                        icon={FaPlus}
                                        onClick={() => addTest(task)}
                                      />
                                    </div>
                                  </th>
                                  <th>Input</th>
                                  <th>Output</th>
                                  <th>Example</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <Controller
                                control={control}
                                name={`tasks.${task.task_number}.tests`}
                                render={({ field: { value: tests } }) => (
                                  <tbody>
                                    {tests.map((test) => (
                                      <Controller
                                        control={control}
                                        name={`tasks.${task.task_number}.tests.${test.test_number}`}
                                        render={({
                                          field: { value: test },
                                        }) => (
                                          <tr>
                                            <td>{test.test_number}</td>
                                            <td>
                                              {parseMemory(
                                                test.input.length / 1000
                                              )}
                                            </td>
                                            <td>
                                              {parseMemory(
                                                test.output.length / 1000
                                              )}
                                            </td>
                                            <td>
                                              {test.is_example ? (
                                                <FaCheck />
                                              ) : (
                                                <FaXmark />
                                              )}
                                            </td>
                                            <td>
                                              <ButtonGroup>
                                                <IconButton
                                                  icon={FaPencil}
                                                  onClick={() => {
                                                    setEditingTask(
                                                      task.task_number
                                                    );
                                                    setEditingTestData(test);
                                                  }}
                                                />
                                                <IconButton
                                                  variant="outline-danger"
                                                  icon={FaTrash}
                                                  onClick={() =>
                                                    removeTest(task, test)
                                                  }
                                                />
                                              </ButtonGroup>
                                            </td>
                                          </tr>
                                        )}
                                      />
                                    ))}
                                  </tbody>
                                )}
                              />
                            </Table>
                            <Button
                              onClick={() => {
                                addTest(task);
                              }}
                            >
                              Add test
                            </Button>
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
        <br />
      </Container>
    </>
  );
};
