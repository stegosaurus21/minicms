import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Contests from "./pages/Contests";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ContestPage from "./pages/Contest";
import Challenge from "./pages/Challenge";
import Results from "./pages/Results";
import { Breadcrumb, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import style from "./styles.module.css";
import { httpBatchLink, httpLink, splitLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./config";
import superjson from "superjson";
import { trpc } from "./utils/trpc";
import ErrorPage from "~components/Error";

export interface TokenProp {
  token: string | null;
}

export interface TokenSetterProp {
  token: [string | null, React.Dispatch<React.SetStateAction<string | null>>];
}

const url = `${document.location.protocol}//${
  import.meta.env.DEV
    ? `${document.location.hostname}:${import.meta.env.VITE_DEV_PORT}`
    : document.location.host
}/trpc`;

export const App: React.FC<{}> = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        splitLink({
          condition(op) {
            // check for context property `skipBatch`
            // don't batch test case fetching
            return (
              op.context.skipBatch === true || op.path === "results.getTest"
            );
          },
          // when condition is true, use normal request
          true: httpLink({
            url,
            async headers() {
              return {
                token: localStorage.getItem("token") || "",
              };
            },
          }),
          // when condition is false, use batching
          false: httpBatchLink({
            url,
            async headers() {
              return {
                token: localStorage.getItem("token") || "",
              };
            },
          }),
        }),
      ],
      transformer: superjson,
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Header />
          <Container>
            <Breadcrumb></Breadcrumb>
          </Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contests" element={<Contests />} />
            <Route path="/contests/:contest" element={<ContestPage />} />
            <Route
              path="/contests/:contest/:challenge"
              element={<Challenge />}
            />
            <Route
              path="/contests/:contest/:challenge/:submission"
              element={<Results />}
            />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="*" element={<ErrorPage messageId="ERR_404" />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </trpc.Provider>
  );
};
