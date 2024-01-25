import { inferRouterInputs } from "@trpc/server";
import { AppRouter } from "../../../../backend/src/app";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { Button, Form, Modal } from "react-bootstrap";

export type ContestCreateData =
  inferRouterInputs<AppRouter>["admin"]["createContest"];

export const NewContestModal = (props: {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: SubmitHandler<ContestCreateData>;
  form: UseFormReturn<ContestCreateData>;
}) => {
  const {
    show,
    setShow,
    onSubmit,
    form: { register, handleSubmit },
  } = props;
  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>New contest</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Choose an ID and title for your new contest.</p>
        <Form onSubmit={handleSubmit(onSubmit)}>
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
  );
};
