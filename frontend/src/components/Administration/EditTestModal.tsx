import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FaUpload } from "react-icons/fa6";
import { IconButton } from "~components/IconButton";
import { EditData, TestData } from "~pages/administration/AdminChallenge";
import { uploadFile, uploadFileText } from "~utils/upload";

export const EditTestModal = (props: {
  data: EditData;
  deleteTest: (data: EditData) => void;
  updateTest: (data: EditData) => void;
}) => {
  const { register, setValue, handleSubmit } = useForm<TestData>({
    values: props.data.test,
  });

  function closeModal() {
    if (props.data.isNew) props.deleteTest(props.data);
    else props.updateTest(props.data);
  }

  return (
    <Modal show onHide={closeModal} backdrop="static">
      <Modal.Header closeButton>Edit test</Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={handleSubmit((data) => {
            const result = { ...props.data, test: data };
            props.updateTest(result);
          })}
        >
          <IconButton
            label="Input"
            icon={FaUpload}
            onClick={async () => {
              const text = await uploadFileText();
              if (!text) return;
              setValue("input", text, { shouldTouch: true });
            }}
          />
          <Form.Control
            required
            as="textarea"
            rows={6}
            style={{ resize: "none", fontFamily: "monospace", marginBottom: 8 }}
            {...register("input")}
          />
          <IconButton
            label="Output"
            icon={FaUpload}
            onClick={async () => {
              const text = await uploadFileText();
              if (!text) return;
              setValue("output", text, { shouldTouch: true });
            }}
          />
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
          <div style={{ display: "flex", gap: 8 }}>
            <Button type="submit">Save</Button>
            <Button variant="danger" onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
