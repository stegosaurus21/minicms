import { format, isLeapYear } from "date-fns";
import React, { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { round2dp, styleScore } from "src/utils/helper";
import {
  ContestChallengeExternal,
  LeaderboardEntry,
  RenderableLeaderboard,
} from "src/interface";

const ContestLeaderboard = (props: {
  showUnofficial: boolean;
  username?: string;
  leaderboard: RenderableLeaderboard[];
  challenges: ContestChallengeExternal[];
}) => {
  const { showUnofficial, username, leaderboard, challenges } = props;
  const total_score = challenges.reduce(
    (prev, next) => prev + next.max_score,
    0
  );
  console.log(leaderboard);
  return (
    <Table bordered className="w-75">
      <thead>
        <tr>
          <th>Place</th>
          <th>User</th>
          <th>{`Total score (/${total_score})`}</th>
          {challenges.map((c) => (
            <th>{`${c.name} (/${c.max_score})`}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {leaderboard.length > 0 ? (
          leaderboard.map((x, i) => (
            <tr
              className={`${
                x.name === username ? "bg-secondary text-light" : ""
              }`}
            >
              <td>{i + 1}</td>
              <td>{x.name}</td>
              <td>{round2dp(x.total)}</td>
              {x.results.map((t, i) => (
                <td
                  className={
                    t.count > 0
                      ? `bg-${styleScore(t.score, challenges[i].max_score)}`
                      : ""
                  }
                >
                  {round2dp(t.score)}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={challenges.length + 3}>
              No {showUnofficial ? "" : "official "}
              participants found for this contest.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default ContestLeaderboard;
