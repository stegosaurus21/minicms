import {
  createTRPCProxyClient,
  createTRPCReact,
  httpBatchLink,
  httpLink,
  splitLink,
} from "@trpc/react-query";
import type { AppRouter } from "../../../backend/src/app";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

export const trpcURL = `${document.location.protocol}//${
  import.meta.env.DEV
    ? `${document.location.hostname}:${import.meta.env.VITE_DEV_PORT}`
    : document.location.host
}/trpc`;

export const trpcClientOptions = {
  links: [
    splitLink({
      condition(op) {
        // check for context property `skipBatch`
        // don't batch test case fetching
        return op.context.skipBatch === true || op.path === "results.getTest";
      },
      // when condition is true, use normal request
      true: httpLink({
        url: trpcURL,
        async headers() {
          return {
            token: localStorage.getItem("token") || "",
          };
        },
      }),
      // when condition is false, use batching
      false: httpBatchLink({
        url: trpcURL,
        async headers() {
          return {
            token: localStorage.getItem("token") || "",
          };
        },
      }),
    }),
  ],
  transformer: superjson,
};

export const trpcVanilla = createTRPCProxyClient<AppRouter>(trpcClientOptions);
