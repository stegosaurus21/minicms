import {
  UseTRPCQueryResult,
  UseTRPCQuerySuccessResult,
} from "@trpc/react-query/dist/shared";
import { Duration, format, formatDuration, intervalToDuration } from "date-fns";
import { error, errorMessages } from "src/components/Error";

export function contestOpen(starts: number | null, ends: number | null) {
  if (starts && Date.now() < starts) return false;
  if (ends && ends < Date.now()) return false;
  return true;
}

export function parseMemory(kb: number | null): string {
  if (kb === null || kb === 0) return "";
  if (kb > 1024) return `${Math.round(kb / 1024)} MB`;
  else return `${kb} KB`;
}

export function round2dp(num: number | null) {
  if (num === null) return 0;
  return Math.round(num * 100) / 100;
}

export function prettyDate(date: number) {
  return format(date, "h:mmaa | EEEE do LLLL y");
}

export function prettyInterval(start: number, end: number) {
  const duration = intervalToDuration({ start: start, end: end });
  const order: (keyof Duration)[] = [
    "seconds",
    "minutes",
    "hours",
    "days",
    "weeks",
    "months",
    "years",
  ];
  let format: string[] = [];
  order.forEach((x, i) => {
    if (duration[x]) {
      format = order.slice(Math.max(0, i - 3), i + 1);
    }
  });
  return formatDuration(duration, {
    format: format.reverse(),
    delimiter: ", ",
  });
}

export function styleScore(
  score: number | null,
  maxScore: number | null,
  pre?: string
) {
  if (score === null || maxScore === null) return `${pre || ""}body text-body`;
  if (score === 0) return `${pre || ""}danger text-light`;
  if (score === maxScore) return `${pre || ""}success text-light`;
  return `${pre || ""}warning text-body`;
}

export function styleStatus(status: string | undefined, pre?: string) {
  if (status === "Checking" || status === undefined)
    return `${pre || ""}body text-body`;
  if (status === "Accepted") return `${pre || ""}success text-light`;
  return `${pre || ""}danger text-light`;
}

export class LoadingMarker extends Error {}

export function assertQuerySuccess<a, b>(
  query: UseTRPCQueryResult<a, b>,
  errorCode?: keyof typeof errorMessages
): asserts query is UseTRPCQuerySuccessResult<a, b> {
  if (query.isLoading) throw new LoadingMarker();
  if (query.isError)
    throw errorCode
      ? error(errorCode)
      : new Error("Query success assertion failed.");
}

export function assertAllQueriesSuccess<a, b>(
  queries: UseTRPCQueryResult<a, b>[],
  errorCode?: keyof typeof errorMessages
): asserts queries is UseTRPCQuerySuccessResult<a, b>[] {
  if (queries.find((x) => x.isError) !== undefined)
    throw errorCode
      ? error(errorCode)
      : new Error("Query success assertion failed.");
  if (queries.find((x) => x.isFetching)) throw new LoadingMarker();
}
