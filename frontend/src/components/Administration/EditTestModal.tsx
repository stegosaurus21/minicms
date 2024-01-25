import { Button, Form, Modal } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { ChallengeData } from "~pages/administration/AdminChallenge";
import { ArrayElement } from "~utils/helper";

export type TestData = ArrayElement<
  ArrayElement<ChallengeData["tasks"]>["tests"]
>;

export const EditTestModal = (props: {
  data: TestData | undefined;
  setTestData: SubmitHandler<TestData>;
}) => {
  const { register, handleSubmit } = useForm<TestData>({
    values: props.data,
  });
  return (
    <Modal show={props.data !== undefined}>
      <Modal.Header>Edit test</Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(props.setTestData)}>
          <Form.Label>Input</Form.Label>
          <Form.Control
            required
            as="textarea"
            rows={6}
            style={{ resize: "none", fontFamily: "monospace" }}
            {...register("input")}
          />
          <Form.Label>Output</Form.Label>
          <Form.Control
            required
            as="textarea"
            rows={6}
            style={{ resize: "none", fontFamily: "monospace" }}
            {...register("output")}
          />
          <Form.Check
            type="switch"
            label="Make this an example task"
            {...register("is_example")}
          />
          <Form.Label>Explanation</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            style={{ resize: "none" }}
            {...register("explanation")}
          />
          <Form.Label>Comment</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            style={{ resize: "none" }}
            {...register("comment")}
          />
          <Form.Text muted>
            This is hidden from participants and purely for helping organise
            test cases.
          </Form.Text>
          <br />
          <Button type="submit">Save</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
