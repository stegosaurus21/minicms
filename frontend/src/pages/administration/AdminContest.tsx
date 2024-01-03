import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import ErrorPage, { error, handleError } from "~components/Error";
import { assertQuerySuccess } from "~utils/helper";
import { trpc } from "~utils/trpc";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "../../../../backend/src/app";
import parse from "date-fns/parse";
import format from "date-fns/format";
import { DateTimeControl } from "~components/Administration/DateTimeControl";

type ContestData = inferRouterOutputs<AppRouter>["contest"]["get"];

export const AdminContest = () => {
  const params = useParams();

  if (!params["contest"]) throw error("ERR_CONTEST_MISSING");
  const queryContestName = params["contest"].replace(":", "/");

  const user = trpc.auth.validate.useQuery();
  const authorization = trpc.auth.isAdmin.useQuery(undefined, {
    enabled: user.isSuccess && user.data.isLoggedIn,
  });
  const contest = trpc.contest.get.useQuery(
    { contest: queryContestName },
    { enabled: authorization.isSuccess, staleTime: Infinity }
  );

  const { control, register, getValues, handleSubmit } = useForm<ContestData>({
    values: contest.data,
    resetOptions: {
      keepDirtyValues: true,
      keepErrors: true,
    },
  });

  function submitForm(data: ContestData) {
    console.log(data);
  }

  try {
    assertQuerySuccess(user, "ERR_AUTH");
  } catch (e) {
    return handleError(e);
  }

  if (!user.data.isLoggedIn) return <ErrorPage messageId="ERR_NOT_ADMIN" />;

  try {
    assertQuerySuccess(authorization, "ERR_NOT_ADMIN");
    assertQuerySuccess(contest, "ERR_CONTEST_FETCH");
  } catch (e) {
    return handleError(e);
  }

  return (
    <>
      <Container>
        <h1>Edit contest</h1>
        <Form onSubmit={handleSubmit(submitForm)}>
          <Form.Label>Contest ID</Form.Label>
          <Form.Control required type="text" {...register("id")} />
          <Form.Label>Contest name</Form.Label>
          <Form.Control required type="text" {...register("name")} />
          <Form.Label>Contest start</Form.Label>
          <DateTimeControl
            control={control}
            field="starts"
            getValues={getValues}
          />
          <Form.Label>Contest ends</Form.Label>
          <DateTimeControl
            control={control}
            field="ends"
            getValues={getValues}
          />
          <br />
          <Button type="submit">Save</Button>
        </Form>
      </Container>
    </>
  );
};
