import { Container, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import ErrorPage, { handleError } from "~components/Error";
import { assertQuerySuccess, useNavigateShim } from "~utils/helper";
import { trpc } from "~utils/trpc";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "../../../../backend/src/app";

type ContestData = inferRouterOutputs<AppRouter>["contest"]["getAdmin"];

export const AdminUsers = () => {
  const params = useParams();
  const utils = trpc.useUtils();
  const navigate = useNavigateShim();

  const queryUser = trpc.auth.validate.useQuery();
  const queryAuthorization = trpc.auth.isAdmin.useQuery(undefined, {
    enabled: queryUser.isSuccess && queryUser.data.isLoggedIn,
  });
  const queryUsers = trpc.admin.getUsers.useQuery(undefined, {
    enabled: queryAuthorization.isSuccess,
  });

  try {
    assertQuerySuccess(queryUser, "ERR_AUTH");
  } catch (e) {
    return handleError(e);
  }

  if (!queryUser.data.isLoggedIn)
    return <ErrorPage messageId="ERR_NOT_ADMIN" />;

  try {
    assertQuerySuccess(queryAuthorization, "ERR_NOT_ADMIN");
    assertQuerySuccess(queryUsers, "ERR_USER_LIST_FETCH");
  } catch (e) {
    return handleError(e);
  }

  return (
    <>
      <h1>Users</h1>
      <Container>
        <Table>
          <tr>
            <th>User ID</th>
            <th>Username</th>
            <th>Admin</th>
          </tr>
          {queryUsers.data.map((x) => {
            return <tr>
              <td>{x.id}</td>
              <td>{x.username}</td>
              <td>{x.admin ? "yes" : "no"}</td>
            </tr>;
          })}
        </Table>
      </Container>
    </>
  );
};
