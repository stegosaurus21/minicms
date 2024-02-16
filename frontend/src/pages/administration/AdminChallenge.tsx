import { inferRouterOutputs } from "@trpc/server";
import { Controller, useForm, useWatch } from "react-hook-form";
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
  ButtonToolbar,
  Container,
  Form,
  Table,
} from "react-bootstrap";
import style from "../../styles.module.css";
import { useState } from "react";
import { EditTestModal } from "~components/Administration/EditTestModal";
import { IconButton } from "~components/IconButton";
import { FaCheck, FaPencil, FaPlus, FaTrash, FaXmark } from "react-icons/fa6";
import {
  TaskStructure,
  UploadError,
  parseZip,
  uploadFile,
  validateTask,
} from "~utils/upload";
import JSZip from "jszip";
import { exportTask } from "~utils/export";

export type ChallengeData =
  inferRouterOutputs<AppRouter>["challenge"]["getAdmin"];
export type TaskData = ArrayElement<ChallengeData["tasks"]>;
export type TestData = ArrayElement<
  ArrayElement<ChallengeData["tasks"]>["tests"]
>;
export type EditData = {
  task: TaskData;
  test: TestData;
  isNew: boolean;
};

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

  const { control, register, setValue, handleSubmit } = useForm<ChallengeData>({
    values: queryChallenge.data,
    resetOptions: {
      keepDirtyValues: true,
    },
  });
  // Hacky, but necessary for my sanity right now
  const values = useWatch({ control: control }) as ChallengeData;
  console.log(values);

  const [editingData, setEditingData] = useState<EditData | undefined>();

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

  function taskIndex(task: TaskData | undefined) {
    if (!task) throw new Error();
    return values.tasks.findIndex((x) => x.task_number === task.task_number);
  }

  function testIndex(task: TaskData | undefined, test: TestData) {
    if (!task) throw new Error();
    return values.tasks[taskIndex(task)].tests.findIndex(
      (x) => x.test_number === test.test_number
    );
  }

  function updateTest(data: EditData) {
    setValue(
      `tasks.${taskIndex(data.task)}.tests.${testIndex(data.task, data.test)}`,
      data.test
    );
    setEditingData(undefined);
  }

  function addTask() {
    const currentTasks = values.tasks;
    const newTaskNumber = currentTasks.length
      ? currentTasks[currentTasks.length - 1].task_number + 1
      : 0;
    setValue("tasks", [
      ...currentTasks,
      {
        type: "INDIVIDUAL",
        weight: 1,
        task_number: newTaskNumber,
        tests: [],
        constraints: "",
      },
    ]);
  }

  function addTest(task: TaskData) {
    const currentTests = values.tasks[taskIndex(task)].tests;
    const newTestNumber = currentTests.length
      ? currentTests[currentTests.length - 1].test_number + 1
      : 0;
    const newTest = {
      test_number: newTestNumber,
      input: "",
      output: "",
      comment: "",
      explanation: "",
      is_example: false,
    };
    setValue(`tasks.${taskIndex(task)}.tests`, [...task.tests, newTest]);
    setEditingData({ task: task, test: newTest, isNew: true });
  }

  function removeTask(task: TaskData) {
    setValue(
      `tasks`,
      values.tasks.filter((x) => x.task_number !== task.task_number)
    );
  }

  async function uploadTask() {
    const zip = await uploadFile();
    if (!zip) return;
    try {
      const zipOutput = await parseZip(
        await JSZip.loadAsync(zip),
        TaskStructure
      );
      return await validateTask(zipOutput);
    } catch (e) {
      if (e instanceof UploadError) {
        refreshToast("error", e.message, "task_upload_err");
        return;
      }
      throw e;
    }
  }

  function downloadTask(task: TaskData) {
    exportTask(task);
  }

  function removeTest(task: TaskData, test: TestData) {
    setValue(
      `tasks.${taskIndex(task)}.tests`,
      values.tasks[taskIndex(task)].tests.filter(
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

  if (values.tasks === undefined) return <></>;
  console.log(editingData);
  return (
    <>
      {editingData && (
        <EditTestModal
          data={editingData}
          deleteTest={(data) => {
            removeTest(data.task, data.test);
            setEditingData(undefined);
          }}
          updateTest={updateTest}
        />
      )}
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
            as="textarea"
            rows={6}
            style={{ resize: "none" }}
            {...register("description")}
          />
          <Form.Label>Input</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            style={{ resize: "none" }}
            {...register("input_format")}
          />
          <Form.Label>Output</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            style={{ resize: "none" }}
            {...register("output_format")}
          />
          <Form.Label>Constraints</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            style={{ resize: "none" }}
            {...register("constraints")}
          />
          <h2>Tasks</h2>
          <Button onClick={addTask}>Add task</Button>
          <Accordion
            className="mt-4"
            alwaysOpen
            defaultActiveKey={values.tasks.map((x) => x.task_number.toString())}
          >
            {values.tasks.map((task, i) => (
              <Accordion.Item eventKey={task.task_number.toString()}>
                <Accordion.Header>
                  {`Task ${task.task_number + 1} (${task.tests.length} tests)`}
                </Accordion.Header>
                <Accordion.Body>
                  <Form.Label>Task weight</Form.Label>
                  <Form.Control
                    required
                    className="w-75"
                    type="number"
                    min={1}
                    max={100}
                    {...register(`tasks.${i}.weight`, { valueAsNumber: true })}
                  />
                  <Form.Label>Task type</Form.Label>
                  <Form.Select
                    className="w-75"
                    {...register(`tasks.${i}.type`)}
                  >
                    <option value="INDIVIDUAL">
                      Individually scored tests
                    </option>
                    <option value="BATCH">Tests batch scored as a task</option>
                  </Form.Select>
                  <Form.Label>Task constraints</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    style={{ resize: "none" }}
                    {...register(`tasks.${i}.constraints`)}
                  />
                  <ButtonToolbar style={{ gap: 8 }}>
                    <ButtonGroup>
                      <Button
                        className="mt-4"
                        onClick={async () => {
                          const data = await uploadTask();
                          if (data === undefined) return;
                          const { config, tests } = data;
                          setValue(`tasks.${i}`, {
                            task_number: task.task_number,
                            tests: tests.map((x, i) => ({
                              input: x.input,
                              test_number: i,
                              output: x.output,
                              is_example: false,
                              explanation: "",
                              comment: x.name,
                            })),
                            weight: config.weight,
                            type: config.type,
                            constraints: config.constraints,
                          });
                        }}
                      >
                        Upload task
                      </Button>
                      <Button
                        className="mt-4"
                        onClick={() => downloadTask(task)}
                      >
                        Download task
                      </Button>
                    </ButtonGroup>
                    <ButtonGroup>
                      <Button
                        className="mt-4"
                        variant="danger"
                        onClick={() => removeTask(task)}
                      >
                        Delete task
                      </Button>
                    </ButtonGroup>
                  </ButtonToolbar>
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
                    <tbody>
                      {task.tests.map((test, j) => (
                        <tr>
                          <td>{test.test_number}</td>
                          <td>{parseMemory(test.input.length / 1000)}</td>
                          <td>{parseMemory(test.output.length / 1000)}</td>
                          <td>{test.is_example ? <FaCheck /> : <FaXmark />}</td>
                          <td>
                            <ButtonGroup>
                              <IconButton
                                icon={FaPencil}
                                onClick={() => {
                                  setEditingData({
                                    task: task,
                                    test: test,
                                    isNew: false,
                                  });
                                }}
                              />
                              <IconButton
                                variant="outline-danger"
                                icon={FaTrash}
                                onClick={() => removeTest(task, test)}
                              />
                            </ButtonGroup>
                          </td>
                        </tr>
                      ))}
                    </tbody>
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
            ))}
          </Accordion>
          <br />
          <Button type="submit">Save</Button>
        </Form>
        <br />
      </Container>
    </>
  );
};
