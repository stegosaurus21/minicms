import { format, isLeapYear } from "date-fns";
import React, { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import {
  prettyDate,
  prettyInterval,
  round2dp,
  styleScore,
} from "src/utils/helper";
import { ContestChallengeExternal, LeaderboardEntry } from "src/interface";

const TimeDisplay = (props: {
  displayDate: number | null;
  refDate: number;
  nullStr: string;
  pastStr: string;
}) => {
  const { displayDate, refDate, nullStr, pastStr } = props;

  if (displayDate === null) {
    return <span>{nullStr}</span>;
  }

  if (displayDate <= refDate) {
    return <span>{pastStr}</span>;
  }

  return (
    <>
      <span>{prettyInterval(refDate, displayDate)}</span>
      <br />
      <span>{prettyDate(refDate)}</span>
    </>
  );
};

export default TimeDisplay;
