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
import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-toastify/dist/ReactToastify.min.css";
import style from "./styles.module.css";
import { httpBatchLink, httpLink, splitLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./config";
import { trpc, trpcClientOptions } from "./utils/trpc";
import ErrorPage from "~components/Error";
import { AdminHome } from "~pages/administration/AdminHome";
import { retryUnlessForbidden } from "~utils/helper";
import { AdminContest } from "~pages/administration/AdminContest";
import { AdminChallenge } from "~pages/administration/AdminChallenge";
import { ToastContainer } from "react-toastify";

export interface TokenProp {
  token: string | null;
}

export interface TokenSetterProp {
  token: [string | null, React.Dispatch<React.SetStateAction<string | null>>];
}

export const App: React.FC<{}> = () => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: retryUnlessForbidden,
          },
        },
      })
  );
  const [trpcClient] = useState(() => trpc.createClient(trpcClientOptions));

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
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/contest/:contest" element={<AdminContest />} />
            <Route
              path="/admin/challenge/:challenge"
              element={<AdminChallenge />}
            />
            <Route path="*" element={<ErrorPage messageId="ERR_404" />} />
          </Routes>
          <ToastContainer position="top-center" autoClose={3000} />
        </Router>
      </QueryClientProvider>
    </trpc.Provider>
  );
};
