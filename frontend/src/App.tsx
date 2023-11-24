import React, { useEffect, useState, createContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
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
import { httpBatchLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./config";
import superjson from "superjson";
import { trpc } from "./utils/trpc";
import ErrorPage, { KnownError, errorMessages } from "./components/Error";

export interface TokenProp {
  token: string | null;
}

export interface TokenSetterProp {
  token: [string | null, React.Dispatch<React.SetStateAction<string | null>>];
}

export const App: React.FC<{}> = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `http://${config.BACKEND_URL}:${config.BACKEND_PORT}/trpc`,
          async headers() {
            return {
              token: localStorage.getItem("token") || "",
            };
          },
        }),
      ],
      transformer: superjson,
    })
  );
  try {
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
            </Routes>
          </Router>
        </QueryClientProvider>
      </trpc.Provider>
    );
  } catch (e) {
    if (e instanceof KnownError) {
      return (
        <>
          <Header />
          <Container>
            <Breadcrumb></Breadcrumb>
          </Container>
          <ErrorPage messageId={e.message} />
        </>
      );
    }
    throw e;
  }
};
