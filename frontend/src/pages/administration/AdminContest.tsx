import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import ErrorPage, { error, handleError } from "~components/Error";
import { assertQuerySuccess } from "~utils/helper";
import { trpc } from "~utils/trpc";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "../../../../backend/src/app";
import style from "../../styles.module.css";
import { DateTimeControl } from "~components/Administration/DateTimeControl";

type ContestData = inferRouterOutputs<AppRouter>["contest"]["get"];

export const AdminContest = () => {
  const params = useParams();
  const navigate = useNavigate();

  if (!params["contest"]) throw error("ERR_CONTEST_MISSING");
  const paramContestId = params["contest"].replace(":", "/");

  const queryUser = trpc.auth.validate.useQuery();
  const queryAuthorization = trpc.auth.isAdmin.useQuery(undefined, {
    enabled: queryUser.isSuccess && queryUser.data.isLoggedIn,
  });
  const queryContest = trpc.contest.get.useQuery(
    { contest: paramContestId },
    { enabled: queryAuthorization.isSuccess, staleTime: Infinity }
  );
  const mutateContest = trpc.admin.updateContest.useMutation();

  const { control, register, getValues, handleSubmit } = useForm<ContestData>({
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
        data: data,
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
  } catch (e) {
    return handleError(e);
  }

  return (
    <>
      <Container>
        <span className={style.returnLink} onClick={() => navigate("./..")}>
          {"<"} Back to contests
        </span>
        <h1>Edit contest</h1>
        <Form onSubmit={handleSubmit(submitForm)}>
          <Form.Label>Contest ID</Form.Label>
          <Form.Control required type="text" {...register("id")} />
          <Form.Label>Contest name</Form.Label>
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
          <br />
          <Button type="submit">Save</Button>
        </Form>
      </Container>
    </>
  );
};
