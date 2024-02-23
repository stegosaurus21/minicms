import {
  createTRPCProxyClient,
  createTRPCReact,
  createWSClient,
  httpBatchLink,
  httpLink,
  splitLink,
  wsLink,
} from "@trpc/react-query";
import type { AppRouter } from "../../../backend/src/app";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();
export const wsClient = createWSClient({
  url: `${document.location.protocol === "https" ? "wss" : "ws"}://${
    import.meta.env.DEV
      ? `${document.location.hostname}:${import.meta.env.VITE_DEV_PORT}`
      : document.location.host
  }/ws`,
});

export const trpcURL = `${document.location.protocol}//${
  import.meta.env.DEV
    ? `${document.location.hostname}:${import.meta.env.VITE_DEV_PORT}`
    : document.location.host
}/trpc`;

export const trpcClientOptions = {
  links: [
    splitLink({
      condition(op) {
        return op.type === "subscription";
      },
      true: wsLink<AppRouter>({
        client: wsClient,
      }),
      false: splitLink({
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
    }),
  ],
  transformer: superjson,
};

export const trpcVanilla = createTRPCProxyClient<AppRouter>(trpcClientOptions);

export function authedWS<A>(payload: A) {
  return { ...payload, _wsAuthToken: localStorage.getItem("token") || "" };
}
